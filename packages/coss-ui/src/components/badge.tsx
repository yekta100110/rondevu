"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@coss/ui/lib/utils";

const badgeVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-full border border-transparent font-medium outline-none transition-colors duration-160 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='opacity-'])]:opacity-80 [&_svg:not([class*='size-'])]:size-3.5 sm:[&_svg:not([class*='size-'])]:size-3 [&_svg]:pointer-events-none [&_svg]:shrink-0 [button&,a&]:cursor-pointer [button&,a&]:pointer-coarse:after:absolute [button&,a&]:pointer-coarse:after:size-full [button&,a&]:pointer-coarse:after:min-h-11 [button&,a&]:pointer-coarse:after:min-w-11",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default:
          "h-5.5 min-w-5.5 px-[calc(--spacing(2)-1px)] text-sm sm:h-5 sm:min-w-5 sm:text-xs",
        lg: "h-6.5 min-w-6.5 px-[calc(--spacing(2.5)-1px)] text-base sm:h-5.5 sm:min-w-5.5 sm:text-sm",
        sm: "h-5 min-w-5 px-[calc(--spacing(1.5)-1px)] text-xs sm:h-4 sm:min-w-4 sm:text-[.625rem]",
      },
      variant: {
        default:
          "bg-primary text-primary-foreground [button&,a&]:hover:bg-primary/80",
        destructive:
          "bg-destructive/10 text-destructive dark:bg-destructive/20 [button&,a&]:hover:bg-destructive/20",
        error:
          "bg-destructive/8 text-destructive-foreground dark:bg-destructive/16",
        info: "border-border bg-background text-foreground dark:bg-input/30",
        outline:
          "border-border bg-background text-foreground [button&,a&]:hover:bg-muted dark:[button&,a&]:hover:bg-muted/50",
        secondary:
          "bg-secondary text-secondary-foreground [button&,a&]:hover:bg-secondary/90",
        success: "border-border bg-background text-foreground dark:bg-input/30",
        warning: "border-dashed border-foreground/40 bg-background text-foreground dark:bg-input/30",
      },
    },
  },
);

interface BadgeProps extends useRender.ComponentProps<"span"> {
  variant?: VariantProps<typeof badgeVariants>["variant"];
  size?: VariantProps<typeof badgeVariants>["size"];
}

function Badge({ className, variant, size, render, ...props }: BadgeProps) {
  const defaultProps = {
    className: cn(badgeVariants({ className, size, variant })),
    "data-slot": "badge",
  };

  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(defaultProps, props),
    render,
  });
}

export { Badge, badgeVariants };
