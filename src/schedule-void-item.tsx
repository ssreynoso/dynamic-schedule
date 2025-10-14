import { ScheduleVoidItemComponentProps } from './modules/dynamic-schedule/types'

export const ScheduleVoidItem = ({ column, row }: ScheduleVoidItemComponentProps) => {
    return (
        <div className='bg-slate-300 w-full h-full flex items-center justify-center'>
            <p>{column.id}</p>
            <p>{row.id}</p>
        </div>
    )
}
