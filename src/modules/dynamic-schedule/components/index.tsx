import { getCoincidences } from '../lib/get-coincidences'
import { useDynamicScheduleStore } from '../stores/dynamic-schedule-store'
import { DynamicScheduleProps } from '../types'
import { DynamicScheduleColumn } from './column'
import { DynamicScheduleColumnHeader } from './column-header'
import { DynamicScheduleContainer } from './container'
import { DynamicScheduleDroppableColumn } from './droppable-column'
import { DynamicScheduleDroppableItem } from './droppable-item'
import { DynamicScheduleFixedColumn } from './fixed-column'
import { DynamicScheduleItem } from './item'
import { VoidCell } from './void-cell'

export const DynamicSchedule = <T,>(props: DynamicScheduleProps<T>) => {
    const { columns, rows, firstColumnText = '', items, ScheduleItemComponent } = props

    const isDragging = useDynamicScheduleStore((state) => state.isDragging)

    const firstColumnWidth = 64
    const headerHeight = 40
    const rowHeight = 100

    const styles = {
        gridTemplateColumns: `${firstColumnWidth}px repeat(${columns.length}, minmax(18rem, 1fr))`,
    }

    return (
        <DynamicScheduleContainer items={items} columns={columns} firstColumnWidth={firstColumnWidth} rowHeight={rowHeight}>
            <DynamicScheduleFixedColumn headerHeight={headerHeight} firstColumnText={firstColumnText} rows={rows} rowHeight={rowHeight} />
            {columns.map((column, idx) => {
                const columnItems = items.filter((i) => i.columnId === column.id)
                const coincidences = getCoincidences(columnItems)

                return (
                    <DynamicScheduleColumn
                        key={`ds-column-[${idx}]`}
                        id={`ds-column-[${idx}]`}
                        isLast={idx === columns.length - 1}
                        saveColumnWidth={idx === 0}
                        rowHeight={rowHeight}
                        hearderHeight={headerHeight}
                    >
                        {columnItems.map((item) => {
                            const itemCoincidences = coincidences.find((c) => c.id === item.id)!

                            return (
                                <DynamicScheduleItem
                                    key={item.id}
                                    id={item.id}
                                    coincidences={itemCoincidences}
                                    row={item.rowStart}
                                    rowSpan={item.rowSpan}
                                >
                                    <ScheduleItemComponent original={item.original} />
                                </DynamicScheduleItem>
                            )
                        })}
                        <DynamicScheduleColumnHeader className='bg-amber-50'>{column.label}</DynamicScheduleColumnHeader>
                        {rows.map((_, idx3) => (
                            <VoidCell key={`void-[${idx}]-[${idx3}]`} />
                        ))}
                    </DynamicScheduleColumn>
                )
            })}
            {isDragging && (
                <div className='absolute grid top-0 left-0 z-[2]' style={styles}>
                    <DynamicScheduleFixedColumn headerHeight={headerHeight} firstColumnText={firstColumnText} rows={rows} rowHeight={rowHeight} />
                    {columns.map((column, idx) => {
                        return (
                            <DynamicScheduleDroppableColumn key={`void-column-[${idx}]`} hearderHeight={headerHeight} rowHeight={rowHeight}>
                                {rows.map((row, idx2) => {
                                    const droppableId = `droppable-[${column.id}]-[${row.id}]`

                                    return (
                                        <DynamicScheduleDroppableItem key={droppableId} colIndex={idx} rowIndex={idx2}>
                                            <div className='w-full h-full flex items-center justify-center'>{droppableId}</div>
                                        </DynamicScheduleDroppableItem>
                                    )
                                })}
                            </DynamicScheduleDroppableColumn>
                        )
                    })}
                </div>
            )}
        </DynamicScheduleContainer>
    )
}
