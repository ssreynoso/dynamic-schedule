import { DraggableAttributes } from '@dnd-kit/core'
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'

import { IntervalScrollingCallback } from '../hooks/use-interval-scrolling'

// Item de la tabla
export interface BaseItem {
    id: string | number
    columnId: number
    rowId: number
    rowSpan: number
}

// Columna de la tabla
export type Column = { id: string | number; label: string }

// Fila de la tabla
export type Row = { id: number; label: string }

// Función que se ejecuta al hacer click en el header
export type HeaderOnClick = (column: Column['id']) => void

// Componente que se renderiza en cada celda
export type SubComponent<T> = (props: SubComponentProps<T>) => React.ReactNode

// Props del componente que se renderiza en cada celda
export type SubComponentProps<T> = {
    item: T & Partial<BaseItem>
    className?: string
    draggableProps?: {
        listeners: SyntheticListenerMap | undefined
        attributes: DraggableAttributes
    }
    onMouseLeave?: () => void
}

export type VoidItemComponent = (props: VoidItemComponentProps) => React.ReactNode

export type VoidItemComponentProps = {
    columnId: Column['id']
    row: Row
    className?: string
    isDragging?: boolean
}

export type ItemToMove<T> = { item: T & BaseItem; newColumnId: number; newRowId: number }

export type OnChangeItemsProps<T> = {
    itemsToMove: ItemToMove<T>[]
    callback: (confirmed: boolean) => void
}

// Props del componente DynamicSchedule
export type DynamicScheduleProps<T> = {
    columns: Column[]
    rows: Row[]

    rowHeight: number
    minColumnWidth: number
    linesPerRow: number

    headerClassName?: string
    linesClassName?: string
    className?: string

    yAxisLabel?: string

    scheduleItems: (T & BaseItem)[]
    setScheduleItems: (items: (T & BaseItem)[]) => void

    ItemComponent: SubComponent<T>
    VoidItemComponent?: VoidItemComponent

    intervalScrollingCallback?: IntervalScrollingCallback

    onHeaderClick?: HeaderOnClick

    currentLinePercentage?: number
}
