import { Icon } from "@/components/ui/icon";

const accentText: Record<string, string> = {
  pink: "text-neon-pink",
  purple: "text-neon-purple",
  blue: "text-neon-blue",
};

export function PageHeader({
  title,
  description,
  icon,
  accent = "pink",
  children,
}: {
  title: string;
  description?: string;
  icon?: string;
  accent?: "pink" | "purple" | "blue";
  children?: React.ReactNode;
}) {
  return (
    <div className="border-b border-white/5">
      <div className="container flex flex-col gap-4 py-12 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            {icon && (
              <span className="flex size-12 items-center justify-center rounded-2xl bg-white/5">
                <Icon name={icon} className={`size-6 ${accentText[accent]}`} />
              </span>
            )}
            <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{title}</h1>
          </div>
          {description && <p className="mt-3 max-w-2xl text-muted-foreground">{description}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}
