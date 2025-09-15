import { cn } from "@/lib/utils";
import { HandHeart } from "lucide-react";

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2 text-primary", className)}>
      <span className="text-2xl font-bold font-headline tracking-wider">Viraasat</span>
    </div>
  );
}
