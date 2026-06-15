import { useState, type FormEvent } from 'react'
import { BRANCHES, type Branch } from '../types'
import { DocIcon, PlusIcon } from './Icons'

interface Props {
  onAdd: (data: { branch: Branch; number: string; comment: string }) => void
}

export default function NewZayavkaForm({ onAdd }: Props) {
  const [branch, setBranch] = useState<Branch>('Свердловское РДУ')
  const [number, setNumber] = useState('')
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!number.trim()) {
      setError('Укажите номер заявки')
      return
    }
    onAdd({ branch, number: number.trim(), comment: comment.trim() })
    setNumber('')
    setComment('')
    setBranch('Свердловское РДУ')
    setError('')
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-slate-800">
        <DocIcon className="h-5 w-5 text-blue-500" />
        Создание новой заявки
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-600">Филиал</label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value as Branch)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              {BRANCHES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-600">Номер заявки</label>
            <input
              value={number}
              onChange={(e) => {
                setNumber(e.target.value)
                if (error) setError('')
              }}
              placeholder="Введите номер заявки"
              className={`w-full rounded-lg border bg-white px-3 py-2.5 text-slate-800 outline-none focus:ring-2 focus:ring-blue-100 ${
                error ? 'border-red-400 focus:border-red-500' : 'border-slate-300 focus:border-blue-500'
              }`}
            />
          </div>

          <div className="md:row-span-2">
            <label className="mb-1.5 block text-sm font-medium text-slate-600">
              Комментарий / описание работ
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Введите комментарий или опишите работы по заявке"
              rows={4}
              className="h-[calc(100%-1.75rem)] min-h-[96px] w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-red-500">{error}</span>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white shadow-sm transition hover:bg-blue-700 active:scale-[.98]"
          >
            <PlusIcon className="h-4 w-4" />
            Добавить заявку
          </button>
        </div>
      </form>
    </section>
  )
}
