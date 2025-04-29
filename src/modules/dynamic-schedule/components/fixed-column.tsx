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
            className={cn('sticky left-0 top-0 z-[2]', className)}
            rowHeight={rowHeight}
            headerHeight={headerHeight}
        >
            <DynamicScheduleColumnHeader className={cn('z-[2] border-none', headerClassName)}>
                {firstColumnText}
            </DynamicScheduleColumnHeader>
            {rows.map((row, idx) => (
                <div className='relative flex h-full w-full' key={row.id}>
                    {idx !== 0 && <span className='absolute right-1 top-0 translate-y-[-50%]'>{row.label}</span>}
                </div>
            ))}
        </DynamicScheduleColumn>
    )
}
