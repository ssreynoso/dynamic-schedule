import { useDraggable } from '@dnd-kit/core'

import { ItemCoincidences } from '../lib/get-coincidences'
import { cn } from '../lib/utils'
import { DynamicScheduleProps, Item } from '../types'

interface DynamicScheduleAbsoluteProps<T> {
    ScheduleItemComponent: DynamicScheduleProps<T>['ScheduleItemComponent']
    item: Item<T>
    className?: string
    id: string
    rowStart: number
    rowSpan: number
    rowHeight: number
    coincidences: ItemCoincidences
}

export const DynamicScheduleItem = <T,>(props: DynamicScheduleAbsoluteProps<T>) => {
    const { item, className, ScheduleItemComponent, rowHeight, rowStart, id, rowSpan, coincidences } = props

    const { attributes, listeners, setNodeRef } = useDraggable({
        id
    })

    const firstRowCoincidence = coincidences.rows[0]?.rowStartCoincidences === 0

    const maxCoincidences = Math.max(...coincidences.rows.map(c => c.coincidentItems))
    const maxOrder = Math.max(...coincidences.rows.map(c => c.order))

    const widthPercent = firstRowCoincidence ? 100 - (maxOrder - 1) * 10 : 100 / (maxCoincidences + 1)
    const translateX = firstRowCoincidence ? 0 : (maxOrder - 1) * 100

    const styles: React.CSSProperties = {
        gridRowStart: rowStart + 1,
        height: `calc(${rowSpan * rowHeight}px - 1px)`,
        width: `calc(${widthPercent}%)`,
        transform: `translateX(${translateX}%)`,
        justifySelf: firstRowCoincidence ? 'flex-end' : undefined
    }

    if (!ScheduleItemComponent) return null

    return (
        <div id={id} ref={setNodeRef} className={cn('absolute', className)} style={styles}>
            <ScheduleItemComponent original={item.original} draggableProps={{ attributes, listeners }} />
        </div>
    )
}
