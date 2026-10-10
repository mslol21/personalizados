import React from "react";
import { Coffee, GlassWater, Wine, Shirt, LayoutGrid, Sparkles, Gift, Package, BookOpen, type LucideIcon } from "lucide-react";
const icons: Record<string, LucideIcon> = { Coffee, GlassWater, Wine, Shirt, LayoutGrid, Sparkles, Gift, Package, BookOpen };
interface DynamicIconProps extends React.SVGProps<SVGSVGElement> { name: string; className?: string; size?: number; }
export function DynamicIcon({ name, className, size = 24, ...props }: DynamicIconProps) {
  const Icon = icons[name] || Sparkles;
  return <Icon className={className} size={size} {...props} />;
}
