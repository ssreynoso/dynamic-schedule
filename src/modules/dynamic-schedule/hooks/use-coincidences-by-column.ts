/* eslint-disable unicorn/no-array-reduce */
import { useMemo } from 'react'

import { DynamicScheduleProps, Item } from '../types'
import { getCoincidences, ItemCoincidences } from '../lib/get-coincidences'

export const useCoincidencesByColumn = <T>(items: Item<T>[], columns: DynamicScheduleProps<T>['columns']) => {
    const coincidencesByColumn = useMemo(() => {
        return columns.reduce(
            (acc, column) => {
                const columnItems = items.filter(i => i.columnId === column.id)
                acc[column.id] = getCoincidences(columnItems)
                return acc
            },
            {} as Record<string, ItemCoincidences[]>
        )
    }, [items, columns])

    return { coincidencesByColumn }
}
