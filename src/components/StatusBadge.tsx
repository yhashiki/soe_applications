import { STATUS_LABEL, type Status } from '../types'

const STYLES: Record<Status, string> = {
  in_progress: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  suspended: 'bg-amber-50 text-amber-700 ring-amber-200',
  not_started: 'bg-slate-100 text-slate-500 ring-slate-200',
}

const DOT: Record<Status, string> = {
  in_progress: 'bg-emerald-500',
  suspended: 'bg-amber-500',
  not_started: 'bg-slate-400',
}

export default function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ring-1 ring-inset ${STYLES[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${DOT[status]}`} />
      {STATUS_LABEL[status]}
    </span>
  )
}
