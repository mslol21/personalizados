import React from "react";
import * as Icons from "lucide-react";

interface DynamicIconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
  className?: string;
  size?: number;
}

export function DynamicIcon({ name, className, size = 24, ...props }: DynamicIconProps) {
  // @ts-expect-error - Dynamic lookup from Lucide icon map
  const IconComponent = Icons[name] || Icons.Sparkles;

  return <IconComponent className={className} size={size} {...props} />;
}
