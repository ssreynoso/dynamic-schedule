import { cn } from '../../dynamic-schedule/lib/utils'
import { getCoincidences } from '../lib/get-coincidences'
import { DynamicScheduleProps } from '../types'
import { DynamicScheduleColumn } from './column'
import { DynamicScheduleColumnHeader } from './column-header'
import { DynamicScheduleContainer } from './container'
import { DynamicScheduleItem } from './item'

export const DynamicSchedule = <T,>(props: DynamicScheduleProps<T>) => {
    const { columns, rows, firstColumnText = '', items, ScheduleItemComponent } = props

    return (
        <DynamicScheduleContainer columns={columns}>
            <DynamicScheduleColumn id='dynamics-schedule-fixed-column' className='sticky left-0 top-0 z-[1] bg-lime-300'>
                <DynamicScheduleColumnHeader className='border-none'>{firstColumnText}</DynamicScheduleColumnHeader>
                {rows.map((row, idx) => (
                    <div className='w-full h-full relative flex' key={row.id}>
                        {idx !== 0 && <span className='absolute top-0 right-1 translate-y-[-50%]'>{row.label}</span>}
                    </div>
                ))}
            </DynamicScheduleColumn>
            {columns.map((column, idx) => {
                const columnItems = items.filter((i) => i.columnId === column.id)
                const coincidences = getCoincidences(columnItems)

                console.log('coincidences', coincidences)

                return (
                    <DynamicScheduleColumn key={`ds-column-[${idx}]`} id={`ds-column-[${idx}]`} isLast={idx === columns.length - 1}>
                        {columnItems.map((item, idx) => {
                            const itemCoincidences = coincidences[idx]

                            return (
                                <DynamicScheduleItem coincidences={itemCoincidences} row={item.rowStart} rowSpan={item.rowSpan}>
                                    <ScheduleItemComponent original={item.original} />
                                </DynamicScheduleItem>
                            )
                        })}
                        <DynamicScheduleColumnHeader className='bg-amber-50'>{column.label}</DynamicScheduleColumnHeader>
                        {rows.map(() => (
                            <div className={cn('w-full h-full border-b flex items-center justify-center')}>Void</div>
                        ))}
                    </DynamicScheduleColumn>
                )
            })}
        </DynamicScheduleContainer>
    )
}
