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

export interface DynamicScheduleProps<T> {
    columns: Column[]
    rows: Row[]
    firstColumnText?: string
    items: Item<T>[]
    ScheduleItemComponent: React.FC<{ original: T }>
}
