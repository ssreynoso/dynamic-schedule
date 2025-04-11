import { DynamicScheduleProps, Row } from '../types'

type Props<T> = Pick<DynamicScheduleProps<T>, 'rows'>

export type VoidCell = { row: Row; rowStart: number; rowEnd: number }

export const calculateVoidCells = <T>({ rows }: Props<T>) => {
    const voidCells: VoidCell[] = []

    for (let i = 1; i <= rows.length; i++) {
        voidCells.push({ row: rows[i - 1], rowStart: i, rowEnd: i + 1 })
    }

    return voidCells
}
