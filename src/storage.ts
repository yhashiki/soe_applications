import { useEffect, useState } from 'react'
import type { Zayavka } from './types'

const STORAGE_KEY = 'kontrol-zayavok:v1'

function load(): Zayavka[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return seed()
    const parsed = JSON.parse(raw) as Zayavka[]
    if (!Array.isArray(parsed)) return seed()
    return parsed
  } catch {
    return seed()
  }
}

// Стартовые демо-заявки (показываются при первом запуске)
function seed(): Zayavka[] {
  return [
    {
      id: crypto.randomUUID(),
      branch: 'Свердловское РДУ',
      number: '12345',
      comment: 'Работы по настройке оборудования. Проверка и настройка каналообразующей аппаратуры.',
      status: 'in_progress',
      createdAt: '2024-05-24T10:15:00',
    },
    {
      id: crypto.randomUUID(),
      branch: 'ОДУ Средней Волги',
      number: '67890',
      comment: 'Плановые работы на оборудовании. Профилактическое обслуживание системы.',
      status: 'suspended',
      createdAt: '2024-05-24T11:20:00',
    },
    {
      id: crypto.randomUUID(),
      branch: 'ЦДУ',
      number: '54321',
      comment: 'Замена модуля связи. Замена вышедшего из строя модуля связи.',
      status: 'not_started',
      createdAt: '2024-05-24T12:05:00',
    },
  ]
}

export function useZayavki() {
  const [items, setItems] = useState<Zayavka[]>(() => load())

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      /* хранилище недоступно — игнорируем */
    }
  }, [items])

  return [items, setItems] as const
}
