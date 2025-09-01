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

    const { attributes, listeners, setNodeRef } = useDraggable({
        id
    })

    const { styles } = useDynamicScheduleItemStyles(props)

    if (!ScheduleItemComponent) return null

    const isSelected = selectedItems.includes(item.id)

    const handleSelectItem = () => {
        if (isSelected) {
            removeSelectedItem(item.id)
        } else {
            addSelectedItem(item.id)
        }
    }

    return (
        <div id={id} ref={setNodeRef} className={cn('absolute', className)} style={styles}>
            {isCtrlPressed && (
                <div
                    onClick={handleSelectItem}
                    className='absolute z-10 flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-blue-500/30 transition-all hover:bg-blue-500/50'
                >
                    {isSelected ? <Minus /> : <Plus />}
                </div>
            )}
            {isSelected && (
                <div className='absolute bottom-1 left-1 rounded-full bg-black p-1 text-white'>
                    <Check size={16} />
                </div>
            )}

            <ScheduleItemComponent original={item.original} draggableProps={{ attributes, listeners }} />
        </div>
    )
}
