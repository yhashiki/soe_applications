import { useMemo } from 'react'
import { useZayavki } from './storage'
import { exportToCsv } from './export'
import type { Branch, Status, Zayavka } from './types'
import NewZayavkaForm from './components/NewZayavkaForm'
import ZayavkaRow from './components/ZayavkaRow'
import { ClipboardIcon, DownloadIcon, ListIcon } from './components/Icons'
import Footer from './components/Footer'

export default function App() {
  const [items, setItems] = useZayavki()

  function addZayavka(data: { branch: Branch; number: string; comment: string }) {
    const z: Zayavka = {
      id: crypto.randomUUID(),
      branch: data.branch,
      number: data.number,
      comment: data.comment,
      status: 'not_started',
      createdAt: new Date().toISOString(),
    }
    setItems((prev) => [z, ...prev])
  }

  function setStatus(id: string, status: Status) {
    setItems((prev) => prev.map((z) => (z.id === id ? { ...z, status } : z)))
  }

  function deleteZayavka(id: string) {
    setItems((prev) => prev.filter((z) => z.id !== id))
  }

  const counts = useMemo(() => {
    return {
      total: items.length,
      inProgress: items.filter((z) => z.status === 'in_progress').length,
      suspended: items.filter((z) => z.status === 'suspended').length,
      notStarted: items.filter((z) => z.status === 'not_started').length,
    }
  }, [items])

  return (
    <div className="flex min-h-screen flex-col">
      {/* Шапка */}
      <header className="bg-slate-900 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <h1 className="flex items-center gap-3 text-xl font-bold">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
              <ClipboardIcon className="h-5 w-5" />
            </span>
            Контроль заявок Дежурного СОЭ
          </h1>
          <button
            onClick={() => exportToCsv(items)}
            disabled={items.length === 0}
            className="inline-flex items-center gap-2 rounded-lg border border-white/25 px-4 py-2 text-sm font-medium transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <DownloadIcon className="h-4 w-4" />
            Экспорт оставшихся заявок
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 space-y-6 px-5 py-6">
        <NewZayavkaForm onAdd={addZayavka} />

        {/* Список */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800">
              <ListIcon className="h-5 w-5 text-slate-500" />
              Список заявок
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">Всего: {counts.total}</span>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">Ведутся: {counts.inProgress}</span>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">Приостановлены: {counts.suspended}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-500">Не начато: {counts.notStarted}</span>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 py-14 text-center text-slate-400">
              Заявок пока нет. Создайте первую заявку через форму выше.
            </div>
          ) : (
            <div className="space-y-3 overflow-hidden rounded-xl">
              {items.map((z) => (
                <ZayavkaRow key={z.id} zayavka={z} onSetStatus={setStatus} onDelete={deleteZayavka} />
              ))}
            </div>
          )}

          <p className="mt-5 text-sm text-slate-400">
            Экспортируются только активные заявки (неудалённые). Формат файла: CSV — открывается в Excel.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  )
}
