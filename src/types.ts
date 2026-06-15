export type Branch =
  | 'Свердловское РДУ'
  | 'Астраханское РДУ'
  | 'Самарское РДУ'
  | 'Нижегородское РДУ'
  | 'Московское РДУ'
  | 'Дагестанское РДУ'
  | 'Саратовское РДУ'
  | 'ОДУ Средней Волги'
  | 'ЦДУ'

export type Status = 'not_started' | 'in_progress' | 'suspended'

export interface Zayavka {
  id: string
  branch: Branch
  number: string
  comment: string
  status: Status
  createdAt: string // ISO-строка
}

export const BRANCHES: Branch[] = [
  'Свердловское РДУ',
  'Астраханское РДУ',
  'Самарское РДУ',
  'Нижегородское РДУ',
  'Московское РДУ',
  'Дагестанское РДУ',
  'Саратовское РДУ',
  'ОДУ Средней Волги',
  'ЦДУ',
]

export const STATUS_LABEL: Record<Status, string> = {
  not_started: 'Не начато',
  in_progress: 'Ведутся работы',
  suspended: 'Приостановлены',
}
