import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

export function useDeleteWithUndo() {
  const { toast } = useToast();

  return function showDeletedToast(onUndo: () => void) {
    toast({
      title: "Slettet",
      description: "Angre innen 5 sekunder.",
      duration: 5000,
      action: <ToastAction altText="Angre" onClick={onUndo}>Angre</ToastAction>,
    });
  };
}
