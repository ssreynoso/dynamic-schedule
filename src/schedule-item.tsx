import { ScheduleItemComponentProps } from './modules/dynamic-schedule/types'

export const ScheduleItem = ({ original, draggableProps }: ScheduleItemComponentProps<{ name: string }>) => {
    return (
        <div className='h-full w-full border bg-red-300'>
            <div
                className='absolute top-1 right-1 h-[20px] w-[20px] cursor-move rounded-full bg-emerald-300'
                {...draggableProps?.attributes}
                {...draggableProps?.listeners}
            ></div>
            <p>{original.name}</p>
        </div>
    )
}
