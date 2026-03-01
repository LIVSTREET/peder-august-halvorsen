import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

type InputType = "input" | "textarea";

type BilingualFieldProps = {
  label: string;
  valueNo: string;
  valueEn: string;
  onChangeNo: (value: string) => void;
  onChangeEn: (value: string) => void;
  type?: InputType;
  required?: boolean;
  noPlaceholder?: string;
  enPlaceholder?: string;
  rows?: number;
  showMissingEn?: boolean;
  onCopyNoToEn?: () => void;
};

export function BilingualField({
  label,
  valueNo,
  valueEn,
  onChangeNo,
  onChangeEn,
  type = "input",
  required = false,
  noPlaceholder,
  enPlaceholder,
  rows = 3,
  showMissingEn = true,
  onCopyNoToEn,
}: BilingualFieldProps) {
  const missingEn = showMissingEn && (!valueEn || valueEn.trim() === "");

  const Component = type === "textarea" ? Textarea : Input;
  const inputProps = type === "textarea" ? { rows } : {};

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label>{label}</Label>
        {onCopyNoToEn && (
          <Button type="button" variant="ghost" size="sm" className="h-auto py-0.5 px-1.5 text-xs text-muted-foreground" onClick={onCopyNoToEn}>
            Kopier norsk → engelsk
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">🇳🇴 Norsk</p>
          <Component
            value={valueNo}
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChangeNo(e.target.value)}
            placeholder={noPlaceholder}
            required={required}
            className={type === "textarea" ? "font-mono text-sm" : ""}
            {...inputProps}
          />
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground">🇬🇧 English</p>
            {missingEn && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-amber-500 border-amber-500/30">
                Mangler engelsk
              </Badge>
            )}
          </div>
          <Component
            value={valueEn}
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChangeEn(e.target.value)}
            placeholder={enPlaceholder}
            className={type === "textarea" ? "font-mono text-sm" : ""}
            {...inputProps}
          />
        </div>
      </div>
    </div>
  );
}
