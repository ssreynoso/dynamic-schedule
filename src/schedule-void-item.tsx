import { ScheduleVoidItemComponentProps } from './modules/dynamic-schedule/types'

export const ScheduleVoidItem = ({ columnId, rowId }: ScheduleVoidItemComponentProps) => {
    return (
        <div className='bg-slate-300 w-full h-full flex items-center justify-center'>
            <p>{columnId}</p>
            <p>{rowId}</p>
        </div>
    )
}
