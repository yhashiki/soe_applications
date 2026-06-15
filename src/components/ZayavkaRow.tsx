import { type Status, type Zayavka } from '../types'
import StatusBadge from './StatusBadge'
import { PlayIcon, PauseIcon, TrashIcon } from './Icons'

interface Props {
  zayavka: Zayavka
  onSetStatus: (id: string, status: Status) => void
  onDelete: (id: string) => void
}

// Цвет определяется по типу филиала (РДУ / ОДУ / ЦДУ)
function branchColor(branch: string): string {
  if (branch.includes('ОДУ')) return 'bg-amber-50 text-amber-600'
  if (branch.includes('ЦДУ')) return 'bg-slate-100 text-slate-600'
  return 'bg-blue-50 text-blue-600' // РДУ и по умолчанию
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function ZayavkaRow({ zayavka, onSetStatus, onDelete }: Props) {
  const z = zayavka
  const isActiveWork = z.status === 'in_progress'
  const isSuspended = z.status === 'suspended'

  return (
    <div className="flex flex-col gap-4 border-l-4 border-blue-400 bg-white px-5 py-4 shadow-sm transition hover:shadow-md lg:flex-row lg:items-center">
      {/* Филиал */}
      <div className="lg:w-40 shrink-0">
        <span className={`inline-block rounded-md px-3 py-1.5 text-sm font-semibold ${branchColor(z.branch)}`}>
          {z.branch}
        </span>
      </div>

      {/* Номер + дата */}
      <div className="lg:w-48 shrink-0">
        <div className="font-semibold text-slate-800">Заявка № {z.number}</div>
        <div className="text-sm text-slate-400">Добавлено: {formatDate(z.createdAt)}</div>
      </div>

      {/* Описание */}
      <div className="min-w-0 flex-1">
        <div className="font-medium text-slate-700">
          {z.comment ? z.comment.split('.')[0] : 'Без описания'}
        </div>
        <div className="truncate text-sm text-slate-500">{z.comment}</div>
      </div>

      {/* Статус */}
      <div className="lg:w-44 shrink-0">
        <StatusBadge status={z.status} />
      </div>

      {/* Действия */}
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <button
          onClick={() => onSetStatus(z.id, 'in_progress')}
          disabled={isActiveWork}
          className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 px-3 py-1.5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <PlayIcon className="h-3.5 w-3.5" />
          Ведутся
        </button>
        <button
          onClick={() => onSetStatus(z.id, 'suspended')}
          disabled={isSuspended}
          className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 px-3 py-1.5 text-sm font-medium text-amber-700 transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <PauseIcon className="h-3.5 w-3.5" />
          Приостановить
        </button>
        <button
          onClick={() => onDelete(z.id)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          <TrashIcon className="h-3.5 w-3.5" />
          Удалить
        </button>
      </div>
    </div>
  )
}
