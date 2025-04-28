import { DynamicScheduleProps } from '../types'
import { DynamicScheduleDroppableColumn } from './droppable-column'
import { DynamicScheduleDroppableItem } from './droppable-item'
import { DynamicScheduleFixedColumn } from './fixed-column'

interface DynamicScheduleDroppableSectionProps<T> {
    columns: DynamicScheduleProps<T>['columns']
    rows: DynamicScheduleProps<T>['rows']
    firstColumnText: DynamicScheduleProps<T>['firstColumnText']
    headerHeight: DynamicScheduleProps<T>['headerHeight']
    rowHeight: DynamicScheduleProps<T>['rowHeight']
    styles?: React.CSSProperties
    firstColumnClassName?: string
}

export const DynamicScheduleDroppableSection = <T,>(props: DynamicScheduleDroppableSectionProps<T>) => {
    const { columns, rows, firstColumnText, headerHeight, rowHeight, styles, firstColumnClassName } = props

    return (
        <div className='absolute grid top-0 left-0 z-[2]' style={styles}>
            <DynamicScheduleFixedColumn
                className={firstColumnClassName}
                headerHeight={headerHeight}
                firstColumnText={firstColumnText}
                rows={rows}
                rowHeight={rowHeight}
            />
            {columns.map((column, idx) => {
                return (
                    <DynamicScheduleDroppableColumn key={`void-column-[${idx}]`} headerHeight={headerHeight} rowHeight={rowHeight}>
                        {rows.map((row, idx2) => {
                            const droppableId = `droppable-[${column.id}]-[${row.id}]`

                            return (
                                <DynamicScheduleDroppableItem key={droppableId} colIndex={idx} rowIndex={idx2}>
                                    <div className='w-full h-full flex items-center justify-center' />
                                </DynamicScheduleDroppableItem>
                            )
                        })}
                    </DynamicScheduleDroppableColumn>
                )
            })}
        </div>
    )
}
