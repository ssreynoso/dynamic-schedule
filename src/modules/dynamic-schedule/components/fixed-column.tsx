import { DynamicScheduleColumn } from './column'
import { DynamicScheduleColumnHeader } from './column-header'

interface DynamicScheduleFixedColumnProps {
    firstColumnText?: string
    rows: { id: string; label: string }[]
    rowHeight: number
    headerHeight: number
}

export const DynamicScheduleFixedColumn = (props: DynamicScheduleFixedColumnProps) => {
    const { firstColumnText = '', rows, rowHeight, headerHeight } = props

    console.log('rendering fixed column')

    return (
        <DynamicScheduleColumn
            id='dynamics-schedule-fixed-column'
            className='sticky left-0 top-0 z-[1] bg-lime-300'
            rowHeight={rowHeight}
            headerHeight={headerHeight}
        >
            <DynamicScheduleColumnHeader className='border-none'>{firstColumnText}</DynamicScheduleColumnHeader>
            {rows.map((row, idx) => (
                <div className='w-full h-full relative flex' key={row.id}>
                    {idx !== 0 && <span className='absolute top-0 right-1 translate-y-[-50%]'>{row.label}</span>}
                </div>
            ))}
        </DynamicScheduleColumn>
    )
}
