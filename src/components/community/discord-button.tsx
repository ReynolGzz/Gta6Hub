import { Button, type ButtonProps } from "@/components/ui/button";
import { DiscordIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

interface DiscordButtonProps {
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
  /** Hide the text label and show only the Discord glyph (e.g. tight navbars). */
  iconOnly?: boolean;
  label?: string;
}

/**
 * "Join Discord" call-to-action. Renders only when NEXT_PUBLIC_DISCORD_URL is
 * set, mirroring how the other integrations degrade gracefully. The invite link
 * is supplied by the site owner via the environment — see .env.example.
 */
export function DiscordButton({
  variant = "secondary",
  size = "sm",
  className,
  iconOnly = false,
  label = "Join Discord",
}: DiscordButtonProps) {
  const url = process.env.NEXT_PUBLIC_DISCORD_URL;
  if (!url) return null;

  return (
    <Button
      asChild
      variant={variant}
      size={size}
      className={cn(
        "border-[#5865F2]/30 text-[#c7ccfb] hover:border-[#5865F2]/60 hover:bg-[#5865F2]/10 hover:text-white",
        className
      )}
    >
      <a href={url} target="_blank" rel="noreferrer" aria-label="Join our Discord server">
        <DiscordIcon className="size-4" />
        {!iconOnly && <span>{label}</span>}
      </a>
    </Button>
  );
}
