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
            className={cn('sticky left-0 top-0 z-2', className)}
            rowHeight={rowHeight}
            headerHeight={headerHeight}
        >
            <DynamicScheduleColumnHeader className={cn('border-none', headerClassName)}>{firstColumnText}</DynamicScheduleColumnHeader>
            {rows.map((row, idx) => (
                <div className='w-full h-full relative flex' key={row.id}>
                    {idx !== 0 && <span className='absolute top-0 right-1 translate-y-[-50%]'>{row.label}</span>}
                </div>
            ))}
        </DynamicScheduleColumn>
    )
}
