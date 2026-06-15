import { STATUS_LABEL, type Zayavka } from './types'

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function escapeCsv(value: string): string {
  const needsQuotes = /[";\n\r]/.test(value)
  const escaped = value.replace(/"/g, '""')
  return needsQuotes ? `"${escaped}"` : escaped
}

// Экспорт активных (оставшихся) заявок в CSV. Открывается в Excel.
export function exportToCsv(items: Zayavka[]): void {
  const headers = ['Филиал', 'Номер заявки', 'Статус', 'Комментарий', 'Добавлено']
  const rows = items.map((z) =>
    [z.branch, z.number, STATUS_LABEL[z.status], z.comment, formatDate(z.createdAt)]
      .map(escapeCsv)
      .join(';'),
  )

  // BOM + ; как разделитель — чтобы Excel корректно открыл кириллицу
  const csv = '﻿' + [headers.join(';'), ...rows].join('\r\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  const stamp = new Date().toISOString().slice(0, 10)
  link.href = url
  link.download = `zayavki_${stamp}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
