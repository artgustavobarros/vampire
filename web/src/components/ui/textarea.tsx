import * as React from "react"
import type { VariantProps } from "class-variance-authority"
import { fieldVariants } from "#/components/ui/input"
import { cn } from "#/lib/utils"

function Textarea({
  className,
  state,
  ...props
}: React.ComponentProps<"textarea"> & VariantProps<typeof fieldVariants>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(fieldVariants({ state }), "resize-y", className)}
      {...props}
    />
  )
}

export { Textarea }
