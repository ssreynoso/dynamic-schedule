import { useDroppable } from '@dnd-kit/core'

import { Column, DynamicScheduleProps } from '../types'
import { VoidCell as TVoidCell } from '../lib/calculate-void-cells'
import { useDynamicScheduleStore } from '../stores/dynamic-schedule-store'
import { cn } from '../lib/utils'

type Props<T> = Pick<DynamicScheduleProps<T>, 'VoidItemComponent'> & {
    column: Column
    cell: TVoidCell
}

export const VoidCell = <T,>({ column, cell, VoidItemComponent }: Props<T>) => {
    const id = `${column.id}-${cell.row.id}`

    const activeItem = useDynamicScheduleStore((state) => state.activeItem)

    const { isOver, setNodeRef } = useDroppable({ id })

    return (
        <div className={cn('h-full w-full', 'relative flex items-center justify-center')}>
            {isOver ? (
                <div className='absolute top-0 h-full w-full bg-slate-300'></div>
            ) : (
                VoidItemComponent && <VoidItemComponent columnId={column.id} row={cell.row} className='z-10' isDragging={!!activeItem} />
            )}
            <div id={id} ref={setNodeRef} className='absolute top-0 z-0 h-full w-full'></div>
        </div>
    )
}
