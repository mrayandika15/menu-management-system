'use client'

import { Button } from '@/components/ui/button'

export type PageHeaderProps = {
  title: string
  subtitle: string
  onExpandAll?: () => void
  onCollapseAll?: () => void
}

export function PageHeader({
  title,
  subtitle,
  onExpandAll,
  onCollapseAll,
}: PageHeaderProps) {
  return (
    <header className="flex items-center justify-between rounded-3xl bg-white px-10 py-6 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center gap-6">
        <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#253BFF]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="white"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v12m6-6H6"
            />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">{subtitle}</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="secondary"
          size="md"
          className="rounded-full"
          onClick={onExpandAll}
        >
          Expand All
        </Button>
        <Button
          variant="outline"
          size="md"
          className="rounded-full"
          onClick={onCollapseAll}
        >
          Collapse All
        </Button>
      </div>
    </header>
  )
}
