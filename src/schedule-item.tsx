import { ScheduleItemComponentProps } from './modules/dynamic-schedule/types'

export const ScheduleItem = ({ original, draggableProps }: ScheduleItemComponentProps<{ name: string }>) => {
    return (
        <div className='bg-red-300 w-full h-full border'>
            <div
                className='bg-emerald-300 w-[20px] h-[20px] rounded-full absolute top-1 right-1 cursor-move'
                {...draggableProps?.attributes}
                {...draggableProps?.listeners}
            ></div>
            <p>{original.name}</p>
        </div>
    )
}
