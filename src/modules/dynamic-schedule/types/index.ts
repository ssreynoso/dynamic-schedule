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

interface OnChangeInput<T> {
    items: Item<T>[]
}

interface ScheduleItemComponentProps<T> {
    original: T
    draggableProps?: {
        attributes: DraggableAttributes
        listeners: SyntheticListenerMap | undefined
    }
}

interface ScheduleVoidItemComponentProps {
    rowId: Row['id']
    columnId: Column['id']
}

export interface DynamicScheduleProps<T> {
    columns: Column[]
    rows: Row[]
    firstColumnText?: string
    items: Item<T>[]
    ScheduleItemComponent: React.FC<ScheduleItemComponentProps<T>>
    VoidItemComponent?: React.FC<ScheduleVoidItemComponentProps>
    onChange: (input: OnChangeInput<T>) => Promise<void>
    firstColumnWidth: number
    headerHeight: number
    rowHeight: number
    minColumnWidth: number
}
