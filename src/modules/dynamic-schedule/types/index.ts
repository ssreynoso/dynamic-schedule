import { DraggableAttributes } from '@dnd-kit/core'
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'

export interface Column {
    id: string
    label: string
}

export interface Row {
    id: string
    label: string
}

export interface Item<T> {
    id: string
    columnId: Column['id']
    rowStart: number
    rowSpan: number
    original: T
}

export interface DynamicScheduleOnChangeCallbackInput<T> {
    items: {
        newScheduleItem: Item<T>
        newColumnId: Column['id']
        newRowId: Row['id']
    }[]
}

export interface ScheduleItemComponentProps<T> {
    original: T
    draggableProps?: {
        attributes: DraggableAttributes
        listeners: SyntheticListenerMap | undefined
    }
}

export interface ScheduleVoidItemComponentProps {
    row: Row
    column: Column
}

export interface ScrollIndicator {
    quantity: number // px
    autoScroll: boolean
}

export type DynamicScheduleOnChangeCallback<T> = (input: DynamicScheduleOnChangeCallbackInput<T>) => Promise<void>

export interface DynamicScheduleProps<T> {
    columns: Column[]
    rows: Row[]
    firstColumnText?: string
    items: Item<T>[]
    ScheduleItemComponent: React.FC<ScheduleItemComponentProps<T>> | null
    VoidItemComponent?: React.FC<ScheduleVoidItemComponentProps>
    onChange?: DynamicScheduleOnChangeCallback<T> | null
    firstColumnWidth: number
    headerHeight: number
    rowHeight: number
    minColumnWidth: number
    scrollIndicator?: ScrollIndicator | null
    headerClassName?: string
    containerClassName?: string
    firstColumnClassName?: string
    currentLineClassName?: string
    getItemCanDragOnX?: (itemId: Item<T>['id']) => boolean
}
