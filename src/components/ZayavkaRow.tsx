import { type Status, type Zayavka } from '../types'
import StatusBadge from './StatusBadge'
import { PlayIcon, PauseIcon, TrashIcon } from './Icons'

interface Props {
  zayavka: Zayavka
  onSetStatus: (id: string, status: Status) => void
  onDelete: (id: string) => void
}

// Цвет «таблетки» филиала по типу (РДУ / ОДУ / ЦДУ)
function branchColor(branch: string): string {
  if (branch.includes('ОДУ')) return 'bg-amber-50 text-amber-600'
  if (branch.includes('ЦДУ')) return 'bg-slate-100 text-slate-600'
  return 'bg-blue-50 text-blue-600' // РДУ и по умолчанию
}

// Цвет левой полоски по статусу заявки
const ACCENT: Record<Status, string> = {
  in_progress: 'border-l-emerald-400',
  suspended: 'border-l-amber-400',
  not_started: 'border-l-slate-300',
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

  // Длинный комментарий показываем кратко (2 строки), полностью — во всплывающей подсказке.
  const isLongComment = !!z.comment && (z.comment.length > 90 || z.comment.includes('\n'))

  return (
    <div
      className={`rounded-xl border border-slate-200 border-l-4 bg-white px-5 py-4 shadow-sm transition hover:shadow-md ${ACCENT[z.status]}`}
    >
      {/* Шапка строки: слева — филиал и номер, справа — статус и действия */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <span className={`inline-block rounded-md px-3 py-1.5 text-sm font-semibold ${branchColor(z.branch)}`}>
            {z.branch}
          </span>
          <div className="min-w-0">
            <div className="font-semibold text-slate-800">Заявка № {z.number}</div>
            <div className="text-xs text-slate-400">Добавлено: {formatDate(z.createdAt)}</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={z.status} />
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

      {/* Комментарий на всю ширину: кратко + полный текст по наведению */}
      <div className="group/cm relative mt-3 border-t border-slate-100 pt-3">
        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Комментарий</div>
        {z.comment ? (
          <p className="line-clamp-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-700">
            {z.comment}
          </p>
        ) : (
          <p className="text-sm italic text-slate-400">Без описания</p>
        )}

        {isLongComment && (
          <div className="pointer-events-none absolute left-0 top-full z-50 mt-1 hidden w-full max-w-2xl rounded-lg border border-slate-200 bg-white p-3 text-sm leading-relaxed text-slate-700 shadow-xl group-hover/cm:block">
            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Полный комментарий
            </div>
            <p className="whitespace-pre-wrap break-words">{z.comment}</p>
          </div>
        )}
      </div>
    </div>
  )
}
