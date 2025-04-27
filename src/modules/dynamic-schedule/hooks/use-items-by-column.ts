import { useMemo } from 'react'
import { Item } from '../types'

export const useItemsByColumn = <T>(items: Item<T>[]) => {
    const itemsByColumn = useMemo(() => {
        return items.reduce((acc, item) => {
            ;(acc[item.columnId] ||= []).push(item)
            return acc
        }, {} as Record<string, Item<T>[]>)
    }, [items])

    return { itemsByColumn }
}
