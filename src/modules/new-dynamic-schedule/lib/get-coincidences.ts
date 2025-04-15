import { DynamicScheduleProps } from '../types'

export interface ItemCoincidences {
    id: string
    rows: {
        row: number
        coincidentItems: number
    }[]
}

export const getCoincidences = <T>(items: DynamicScheduleProps<T>['items']) => {
    const coincidences: ItemCoincidences[] = items.map((currentItem) => {
        const start = currentItem.rowStart
        const end = start + currentItem.rowSpan - 1

        const rows = []
        for (let row = start; row <= end; row++) {
            let count = 0
            for (const otherItem of items) {
                if (otherItem.id === currentItem.id) continue

                const otherStart = otherItem.rowStart
                const otherEnd = otherStart + otherItem.rowSpan - 1

                // Si la fila actual cae dentro del rango de otherItem, hay coincidencia
                if (row >= otherStart && row <= otherEnd) {
                    count++
                }
            }
            rows.push({ row, coincidentItems: count })
        }

        return {
            id: currentItem.id,
            rows,
        }
    })

    return coincidences
}
