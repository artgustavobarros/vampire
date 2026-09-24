import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "#/lib/utils"

/** Campo de texto do standalone: 12px de respiro, serifada 18px, borda fina. */
const fieldVariants = cva(
  "w-full rounded-none border border-line bg-field p-3 font-normal font-serif text-ink text-lg leading-[1.4] outline-none transition-[border-color,background-color] duration-150 ease-[ease] placeholder:text-ink-ghost hover:border-line-strong focus:border-line-focus focus:shadow-none focus-visible:border-line-focus disabled:cursor-not-allowed disabled:opacity-45 aria-invalid:border-blood",
  {
    variants: {
      state: {
        default: "",
        ok: "border-moss hover:border-moss focus:border-moss focus-visible:border-moss",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
)

function Input({
  className,
  type,
  state,
  ...props
}: React.ComponentProps<"input"> & VariantProps<typeof fieldVariants>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(fieldVariants({ state }), className)}
      {...props}
    />
  )
}

export { Input, fieldVariants }
