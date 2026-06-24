"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <>
      <style>{`
        [data-description] {
          color: #000000 !important;
          opacity: 1 !important;
        }
      `}</style>
      <Sonner
        theme="system"
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
            "--normal-bg": "#ffffff",
            "--normal-text": "#000000",
            "--normal-border": "#eaecf0",
            "--border-radius": "8px",
          } as React.CSSProperties
        }
        toastOptions={{
          classNames: {
            toast: "cn-toast",
          },
        }}
        {...props}
      />
    </>
  )
}

export { Toaster }
