import { cn } from '@/lib/utils'

export type FieldProps = {
  label: string
  value: string
  disabled?: boolean
}

export function Field({ label, value, disabled = false }: FieldProps) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
      <span className="text-slate-500">{label}</span>
      <div
        className={cn(
          'flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold',
          disabled
            ? 'border-slate-200 bg-slate-100 text-slate-400'
            : 'border-slate-200 bg-white text-slate-900',
        )}
      >
        <span>{value}</span>
        {!disabled ? (
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
              d="M19.5 8.25 12 15.75 4.5 8.25"
            />
          </svg>
        ) : null}
      </div>
    </label>
  )
}