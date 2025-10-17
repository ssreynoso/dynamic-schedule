import { ScheduleVoidItemComponentProps } from './modules/dynamic-schedule'

export const ScheduleVoidItem = ({ column, row }: ScheduleVoidItemComponentProps) => {
    return (
        <div
            style={{
                backgroundColor: '#cbd5e1',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <p>{column.id}</p>
            <p>{row.id}</p>
        </div>
    )
}
