import { getCoincidences } from '../lib/get-coincidences'
import { DynamicScheduleProps } from '../types'
import { DynamicScheduleColumn } from './column'
import { DynamicScheduleColumnHeader } from './column-header'
import { DynamicScheduleContainer } from './container'
import { DynamicScheduleItem } from './item'
import { VoidCell } from './void-cell'

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

                return (
                    <DynamicScheduleColumn key={`ds-column-[${idx}]`} id={`ds-column-[${idx}]`} isLast={idx === columns.length - 1}>
                        {columnItems.map((item, idx2) => {
                            const itemCoincidences = coincidences[idx2]

                            return (
                                <DynamicScheduleItem
                                    key={`ds-[${idx}]-[${idx2}]`}
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
        </DynamicScheduleContainer>
    )
}
