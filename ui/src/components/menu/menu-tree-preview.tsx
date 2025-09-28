'use client'

import { Button } from '@/components/ui/button'

export type MenuTreePreviewProps = {
  title?: string
  onAddMenu?: () => void
  children?: React.ReactNode
}

export function MenuTreePreview({
  title = 'Menu Tree Preview',
  onAddMenu,
  children,
}: MenuTreePreviewProps) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full text-slate-500"
          onClick={onAddMenu}
        >
          <span className="sr-only">Add menu</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v12m6-6H6"
            />
          </svg>
        </Button>
      </div>

      <div className="mt-4 space-y-4">{children}</div>
    </section>
  )
}
