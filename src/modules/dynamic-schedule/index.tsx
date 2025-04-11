import { useEffect, useMemo, useRef, useState } from 'react'

import { DynamicScheduleHeader } from './components/header'
import { DynamicScheduleHeaderItem } from './components/header-item'
import { DynamicScheduleLines } from './components/lines'
import { DynamicScheduleColumns } from './components/columns'
import { DynamicScheduleColumn } from './components/column'
import { DynamicScheduleRows } from './components/rows'
import { ColumnItems } from './components/column-items'
import { VoidCells } from './components/void-cells'
import { DynamicScheduleProps } from './types'
import { VoidCellsColumn } from './components/void-cells-column'
import { ColumnItemsContainer } from './components/column-items-container'
import { useKeyboardListeners } from './hooks/use-keyboard-listeners'
import { useAutoScroll } from './hooks/use-auto-scroll'
import { DynamicScheduleCurrentLine } from './components/current-line'
import { useDynamicScheduleStore } from './stores/dynamic-schedule-store'
import { cn, generateUUID } from './lib/utils'

export const DynamicSchedule = <T,>(props: DynamicScheduleProps<T>) => {
    const {
        columns,
        rows,
        rowHeight,
        minColumnWidth,
        linesPerRow,
        className,
        linesClassName,
        headerClassName,
        scheduleItems,
        yAxisLabel,
        ItemComponent,
        VoidItemComponent,
        onHeaderClick,
    } = props

    const [wasScrolled, setWasScrolled] = useState(false)

    const containerRef = useRef<HTMLDivElement>(null)
    const firstColumnsWidth = 100
    const styleObject = {
        columns: {
            gridTemplateColumns: `${firstColumnsWidth}px repeat(${columns.length}, minmax(${minColumnWidth}px, 1fr))`,
        },
        rows: { gridTemplateRows: `repeat(${rows.length}, ${rowHeight * linesPerRow}px)` },
        rowsLines: { gridTemplateRows: `repeat(${rows.length * linesPerRow}, ${rowHeight}px)` },
    }

    useKeyboardListeners()

    const { handleMouseMove } = useAutoScroll(containerRef)

    const containerHeight = useMemo(() => {
        return rowHeight * linesPerRow * rows.length
    }, [rowHeight, linesPerRow, rows.length])

    const containerWidth = useMemo(() => {
        return firstColumnsWidth + columns.length * minColumnWidth
    }, [firstColumnsWidth, columns.length, minColumnWidth])

    const currentLinePercentage = useDynamicScheduleStore((state) => state.currentLinePercentage)

    useEffect(() => {
        if (!currentLinePercentage || wasScrolled || currentLinePercentage < 0 || containerHeight === 0 || !containerRef.current) {
            return
        }

        const pixelsToTop = (containerHeight * currentLinePercentage) / 100 - 200

        containerRef.current.scrollTo({ top: pixelsToTop, behavior: 'smooth' })
        setWasScrolled(true)
    }, [currentLinePercentage])

    return (
        <div
            ref={containerRef}
            className={cn(
                'relative h-full rounded border bg-background px-4',
                'pretty-scrollbar pretty-scrollbar-y pretty-scrollbar-x overflow-x-auto overflow-y-auto',
                className
            )}
            onMouseMove={handleMouseMove}
        >
            <DynamicScheduleHeader className={headerClassName} style={styleObject.columns}>
                <DynamicScheduleHeaderItem columnId={0}>{yAxisLabel || 'Eje y'}</DynamicScheduleHeaderItem>
                {columns.map((column) => (
                    <DynamicScheduleHeaderItem key={`th-${column.id}`} onClick={onHeaderClick} columnId={column.id}>
                        {column.label}
                    </DynamicScheduleHeaderItem>
                ))}
            </DynamicScheduleHeader>

            <DynamicScheduleLines
                columns={columns.length}
                rows={rows.length * linesPerRow}
                columnsStyle={styleObject.columns}
                rowsStyle={styleObject.rowsLines}
                className={linesClassName}
            />

            <DynamicScheduleCurrentLine containerWidth={containerWidth} headerHeight={48} containerHeight={containerHeight} />

            <DynamicScheduleColumns style={styleObject.columns}>
                <DynamicScheduleRows rows={rows} style={styleObject.rows} className={cn(`sticky left-0 z-30`)} />

                {columns.map((column) => {
                    const columnItems = scheduleItems.filter((i) => i.columnId === column.id)

                    return (
                        <DynamicScheduleColumn key={generateUUID()}>
                            <VoidCellsColumn style={styleObject.rows}>
                                <VoidCells column={column} rows={rows} VoidItemComponent={VoidItemComponent} ItemComponent={ItemComponent} />
                            </VoidCellsColumn>
                            <ColumnItemsContainer rows={rows.length} style={styleObject.rows}>
                                <ColumnItems ItemComponent={ItemComponent} columnItems={columnItems} />
                            </ColumnItemsContainer>
                        </DynamicScheduleColumn>
                    )
                })}
            </DynamicScheduleColumns>
        </div>
    )
}
