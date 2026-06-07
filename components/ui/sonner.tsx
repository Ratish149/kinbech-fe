"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:p-4 group-[.toaster]:rounded-2xl group-[.toaster]:border",
          description: "group-[.toast]:text-muted-foreground text-[12px] mt-0.5",
          success: "group-[.toaster]:!bg-emerald-50 group-[.toaster]:!text-emerald-900 group-[.toaster]:!border-emerald-200/80 [&_svg]:!text-emerald-600 [&_[data-description]]:!text-emerald-800/90 dark:group-[.toaster]:!bg-emerald-950/30 dark:group-[.toaster]:!text-emerald-200 dark:group-[.toaster]:!border-emerald-900/50 dark:[&_svg]:!text-emerald-400 dark:[&_[data-description]]:!text-emerald-300/90",
          error: "group-[.toaster]:!bg-rose-50 group-[.toaster]:!text-rose-900 group-[.toaster]:!border-rose-200/80 [&_svg]:!text-rose-600 [&_[data-description]]:!text-rose-800/90 dark:group-[.toaster]:!bg-rose-950/30 dark:group-[.toaster]:!text-rose-200 dark:group-[.toaster]:!border-rose-900/50 dark:[&_svg]:!text-rose-400 dark:[&_[data-description]]:!text-rose-300/90",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
