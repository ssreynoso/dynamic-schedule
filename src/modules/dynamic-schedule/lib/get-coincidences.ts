import { DynamicScheduleProps } from '../types'

export interface ItemCoincidences {
    id: string
    rows: {
        row: number
        coincidentItems: number
        order: number
        rowStartCoincidences: number
    }[]
}

export function getCoincidences<T>(items: DynamicScheduleProps<T>['items']): ItemCoincidences[] {
    return items.map(currentItem => {
        const start = currentItem.rowStart
        const end = start + currentItem.rowSpan - 1

        const rowsInfo = []
        for (let row = start; row <= end; row++) {
            const overlappingItems = []
            let rowStartCoincidences = 0

            for (const otherItem of items) {
                if (otherItem.id === currentItem.id) {
                    overlappingItems.push(otherItem)
                    continue
                }

                const otherStart = otherItem.rowStart
                const otherEnd = otherStart + otherItem.rowSpan - 1
                if (row >= otherStart && row <= otherEnd) {
                    overlappingItems.push(otherItem)
                }

                if (row === start && otherItem.rowStart === start) {
                    rowStartCoincidences++
                }
            }

            const order = overlappingItems.findIndex(i => i.id === currentItem.id) + 1

            const coincidentItems = overlappingItems.length - 1

            rowsInfo.push({ row, coincidentItems, order, rowStartCoincidences })
        }

        return {
            id: currentItem.id,
            rows: rowsInfo
        }
    })
}
