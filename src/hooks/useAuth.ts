import { useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AuthState = {
  user: User | null;
  session: Session | null;
  isOwner: boolean | null;
  isLoading: boolean;
};

async function checkOwner(session: Session | null): Promise<AuthState> {
  if (!session) {
    return { user: null, session: null, isOwner: false, isLoading: false };
  }
  try {
    const { data: isOwner } = await supabase.rpc("is_owner");
    return {
      user: session.user,
      session,
      isOwner: isOwner === true,
      isLoading: false,
    };
  } catch {
    return {
      user: session.user,
      session,
      isOwner: false,
      isLoading: false,
    };
  }
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isOwner: null,
    isLoading: true,
  });

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      checkOwner(session).then(setState);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      checkOwner(session).then(setState);
    });

    return () => subscription.unsubscribe();
  }, []);

  return state;
}
