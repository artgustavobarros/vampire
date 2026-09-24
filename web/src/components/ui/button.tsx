import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "#/lib/utils"
import { Slot } from "radix-ui"

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-none border font-label font-semibold text-xs uppercase leading-none tracking-[.12em] outline-none transition-[opacity,border-color,transform] duration-150 hover:opacity-85 focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "border-ink bg-ink text-white",
        destructive: "border-blood bg-blood text-white",
        success: "border-moss bg-moss text-white",
        outline: "border-line bg-transparent text-ink",
        ghost: "border-transparent bg-transparent text-ink",
        link: "border-transparent bg-transparent text-blood underline-offset-4 hover:underline",
      },
      size: {
        default: "min-h-12 px-4 py-4",
        sm: "min-h-9 px-3 py-2",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
