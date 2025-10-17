import { cn } from '../lib/utils'

import { DynamicScheduleColumn } from './column'
import { DynamicScheduleColumnHeader } from './column-header'

interface DynamicScheduleFixedColumnProps {
    firstColumnText?: string
    rows: { id: string; label: string }[]
    rowHeight: number
    headerHeight: number
    className?: string
    headerClassName?: string
}

export const DynamicScheduleFixedColumn = (props: DynamicScheduleFixedColumnProps) => {
    const { firstColumnText = '', rows, rowHeight, headerHeight, className, headerClassName } = props

    return (
        <DynamicScheduleColumn
            id='dynamics-schedule-fixed-column'
            className={cn('ds-sticky ds-top-0 ds-left-0 ds-z-2', className)}
            rowHeight={rowHeight}
            headerHeight={headerHeight}
        >
            <DynamicScheduleColumnHeader className={cn('ds-z-2 ds-border-none', headerClassName)}>
                {firstColumnText}
            </DynamicScheduleColumnHeader>
            {rows.map((row, idx) => (
                <div className='ds-relative ds-flex ds-h-full ds-w-full' key={row.id}>
                    {idx !== 0 && <span className='ds-absolute ds-top-0 ds-right-1 ds-translate-y-neg-50'>{row.label}</span>}
                </div>
            ))}
        </DynamicScheduleColumn>
    )
}
