import { DragOverlay } from '@dnd-kit/core'
import { cn } from '../lib/utils'
import { useDynamicScheduleStore } from '../stores/dynamic-schedule-store'

export const DynamicScheduleDragOverlay = () => {
    const columnWidth = useDynamicScheduleStore((state) => state.columnWidth)
    const activeItem = useDynamicScheduleStore((state) => state.activeItem)

    return (
        <DragOverlay dropAnimation={null}>
            {activeItem ? (
                <div
                    className={cn('bg-red-300 h-full border flex items-center justify-center justify-self-auto flex-col gap-4')}
                    style={{ width: columnWidth || 300 }}
                >
                    <p>{activeItem.id}</p>
                    <p>rowspan: {activeItem.rowSpan}</p>
                    <p>
                        ({activeItem.colIndex}, {activeItem.rowIndex})
                    </p>

                    {/* <div className='w-[300px] h-[300px] absolute left-[-100%] top-[-10%] bg-lime-300'>asd</div> */}
                </div>
            ) : null}
        </DragOverlay>
    )
}
