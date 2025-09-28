'use client'

import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'

export type MenuFormProps = {
  selectedMenu?: string
  menuId?: string
  depth?: string
  parentData?: string
  name?: string
  onMenuSelect?: (menu: string) => void
  onSave?: () => void
}

export function MenuForm({
  selectedMenu = 'system management',
  menuId = '56320ee9-6af6-11ed-a7ba-f220afe5e4a9',
  depth = '3',
  parentData = 'Systems',
  name = 'System Code',
  onMenuSelect,
  onSave,
}: MenuFormProps) {
  return (
    <section className="space-y-5 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="space-y-3">
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
          <span className="text-slate-500">Menu</span>
          <button
            className="flex items-center justify-between rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-900"
            onClick={() => onMenuSelect?.(selectedMenu)}
          >
            {selectedMenu}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-5 w-5 text-slate-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m6 9 6 6 6-6"
              />
            </svg>
          </button>
        </label>
      </div>

      <div className="grid gap-4">
        <Field label="Menu ID" value={menuId} disabled />
        <Field label="Depth" value={depth} disabled />
        <Field label="Parent Data" value={parentData} />
        <Field label="Name" value={name} />
      </div>

      <div className="pt-4">
        <Button className="w-full rounded-full" size="lg" onClick={onSave}>
          Save
        </Button>
      </div>
    </section>
  )
}
