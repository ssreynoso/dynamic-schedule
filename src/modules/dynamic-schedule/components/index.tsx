import { useDynamicScheduleStore } from '../stores/dynamic-schedule-store'
import { DynamicScheduleProps } from '../types'
import { DynamicScheduleColumn } from './column'
import { DynamicScheduleColumnHeader } from './column-header'
import { DynamicScheduleContainer } from './container'
import { DynamicScheduleDroppableSection } from './droppable-section'
import { DynamicScheduleFixedColumn } from './fixed-column'
import { DynamicScheduleItem } from './item'
import { VoidCell } from './void-cell'
import { useCoincidencesByColumn } from '../hooks/use-coincidences-by-column'
import { useItemsByColumn } from '../hooks/use-items-by-column'
import { useMemo } from 'react'

export const DynamicSchedule = <T,>(props: DynamicScheduleProps<T>) => {
    const {
        columns,
        rows,
        firstColumnText = '',
        items,
        ScheduleItemComponent,
        VoidItemComponent,
        onChange,
        firstColumnWidth,
        headerHeight,
        rowHeight,
        minColumnWidth,
        scrollIndicator,
    } = props

    const isDragging = useDynamicScheduleStore((state) => state.isDragging)

    const styles = useMemo(
        () => ({
            gridTemplateColumns: `${firstColumnWidth}px repeat(${columns.length}, minmax(${minColumnWidth}px, 1fr))`,
        }),
        [firstColumnWidth, columns.length, minColumnWidth]
    )

    const { itemsByColumn } = useItemsByColumn(items)
    const { coincidencesByColumn } = useCoincidencesByColumn(items, columns)

    return (
        <DynamicScheduleContainer
            items={items}
            columns={columns}
            styles={styles}
            rowHeight={rowHeight}
            rows={rows}
            onChange={onChange}
            scrollIndicator={scrollIndicator}
            headerHeight={headerHeight}
        >
            <DynamicScheduleFixedColumn headerHeight={headerHeight} firstColumnText={firstColumnText} rows={rows} rowHeight={rowHeight} />
            {columns.map((column, idx) => {
                const columnItems = itemsByColumn[column.id] || []
                const coincidences = coincidencesByColumn[column.id]

                const id = `ds-column-[${column.id}]`

                return (
                    <DynamicScheduleColumn
                        id={id}
                        key={id}
                        isLast={idx === columns.length - 1}
                        saveColumnWidth={idx === 0}
                        rowHeight={rowHeight}
                        headerHeight={headerHeight}
                    >
                        {columnItems.map((item) => {
                            const itemCoincidences = coincidences.find((c) => c.id === item.id)!

                            return (
                                <DynamicScheduleItem
                                    item={item}
                                    ScheduleItemComponent={ScheduleItemComponent}
                                    key={item.id}
                                    id={item.id}
                                    coincidences={itemCoincidences}
                                    row={item.rowStart}
                                    rowSpan={item.rowSpan}
                                />
                            )
                        })}
                        <DynamicScheduleColumnHeader className='bg-amber-50'>{column.label}</DynamicScheduleColumnHeader>
                        {rows.map((row) => {
                            const key = `void-[${column.id}]-[${row.id}]`

                            return <VoidCell key={key}>{VoidItemComponent && <VoidItemComponent columnId={column.id} rowId={row.id} />}</VoidCell>
                        })}
                    </DynamicScheduleColumn>
                )
            })}
            {isDragging && (
                <DynamicScheduleDroppableSection
                    columns={columns}
                    rows={rows}
                    firstColumnText={firstColumnText}
                    headerHeight={headerHeight}
                    rowHeight={rowHeight}
                    styles={styles}
                />
            )}
        </DynamicScheduleContainer>
    )
}
