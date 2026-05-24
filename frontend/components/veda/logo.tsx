import { Leaf } from "lucide-react"
import { cn } from "@/lib/utils"

type VedaLogoProps = {
  className?: string
  textClassName?: string
}

export function VedaLogo({ className, textClassName }: VedaLogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Leaf className="size-4" />
      </div>
      <span
        className={cn("text-lg font-semibold text-foreground", textClassName)}
      >
        VedaAI
      </span>
    </div>
  )
}
