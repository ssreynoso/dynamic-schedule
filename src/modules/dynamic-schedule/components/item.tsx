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
    selectedItemCheckClassName?: string
    selectedItemCheckStyle?: React.CSSProperties
    ctrlButtonClassName?: string
    ctrlButtonStyle?: React.CSSProperties
    itemCanBeSelected?: boolean
}

export const DynamicScheduleItem = <T,>(props: DynamicScheduleAbsoluteProps<T>) => {
    const {
        item,
        className,
        ScheduleItemComponent,
        id,
        selectedItemCheckClassName,
        selectedItemCheckStyle,
        ctrlButtonClassName,
        ctrlButtonStyle,
        itemCanBeSelected = true
    } = props

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
            {itemCanBeSelected && (
                <SelectionComponent
                    isCtrlPressed={isCtrlPressed}
                    isSelected={isSelected}
                    selectedItemCheckClassName={selectedItemCheckClassName}
                    selectedItemCheckStyle={selectedItemCheckStyle}
                    ctrlButtonClassName={ctrlButtonClassName}
                    ctrlButtonStyle={ctrlButtonStyle}
                    onSelectItem={handleSelectItem}
                />
            )}
            <ScheduleItemComponent original={item.original} draggableProps={{ attributes, listeners }} />
        </div>
    )
}

interface SelectionComponentProps {
    isCtrlPressed: boolean | undefined
    onSelectItem: () => void
    isSelected: boolean
    selectedItemCheckClassName?: string
    selectedItemCheckStyle?: React.CSSProperties
    ctrlButtonClassName?: string
    ctrlButtonStyle?: React.CSSProperties
}

const SelectionComponent = (props: SelectionComponentProps) => {
    const {
        isCtrlPressed,
        isSelected,
        selectedItemCheckClassName,
        selectedItemCheckStyle,
        ctrlButtonClassName,
        ctrlButtonStyle,
        onSelectItem
    } = props

    return (
        <>
            {isCtrlPressed && (
                <div
                    onClick={onSelectItem}
                    className={cn(
                        'ds-absolute ds-z-10 ds-flex ds-h-full ds-w-full ds-cursor-pointer ds-items-center ds-justify-center ds-bg-blue-500-30 ds-transition-all ds-hover-bg-blue-500-50',
                        ctrlButtonClassName
                    )}
                    style={ctrlButtonStyle}
                >
                    {isSelected ? <Minus /> : <Plus />}
                </div>
            )}
            {isSelected && (
                <div
                    className={cn(
                        'ds-absolute ds-bottom-1 ds-left-1 ds-rounded-full ds-bg-black ds-p-1 ds-text-white',
                        selectedItemCheckClassName
                    )}
                    style={selectedItemCheckStyle}
                >
                    <Check size={16} />
                </div>
            )}
        </>
    )
}
