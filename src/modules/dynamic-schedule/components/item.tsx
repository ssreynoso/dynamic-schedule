import { useDraggable } from '@dnd-kit/core'
import { Check, Minus, Plus } from 'lucide-react'

import { useDynamicScheduleItemStyles } from '../hooks/use-dynamic-schedule-item-styles'
import { ItemCoincidences } from '../lib/get-coincidences'
import { cn } from '../lib/utils'
import { useDynamicScheduleSelectedItemsStore } from '../stores/dynamic-schedule-selected-items-store'
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
    const { item, className, ScheduleItemComponent, id } = props

    const isCtrlPressed = useDynamicScheduleSelectedItemsStore(state => state.isCtrlPressed)
    const selectedItems = useDynamicScheduleSelectedItemsStore(state => state.selectedItems)
    const addSelectedItem = useDynamicScheduleSelectedItemsStore(state => state.addSelectedItem)
    const removeSelectedItem = useDynamicScheduleSelectedItemsStore(state => state.removeSelectedItem)

    const { attributes, listeners, setNodeRef, node } = useDraggable({
        id
    })

    const { styles } = useDynamicScheduleItemStyles(props)

    if (!ScheduleItemComponent) return null

    const isSelected = selectedItems.has(item.id)

    const handleSelectItem = () => {
        if (isSelected) {
            removeSelectedItem({ id: item.id })
        } else {
            addSelectedItem({ id: item.id, rect: node.current?.getBoundingClientRect(), original: item.original })
        }
    }

    return (
        <div id={id} ref={setNodeRef} className={cn('ds-absolute', className)} style={styles}>
            {isCtrlPressed && (
                <div
                    onClick={handleSelectItem}
                    className='ds-absolute ds-z-10 ds-flex ds-h-full ds-w-full ds-cursor-pointer ds-items-center ds-justify-center ds-rounded-lg ds-bg-blue-500-30 ds-transition-all ds-hover-bg-blue-500-50'
                >
                    {isSelected ? <Minus /> : <Plus />}
                </div>
            )}
            {isSelected && (
                <div className='ds-absolute ds-bottom-1 ds-left-1 ds-rounded-full ds-bg-black ds-p-1 ds-text-white'>
                    <Check size={16} />
                </div>
            )}

            <ScheduleItemComponent original={item.original} draggableProps={{ attributes, listeners }} />
        </div>
    )
}
