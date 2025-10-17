import { ScheduleItemComponentProps } from './modules/dynamic-schedule'

export const ScheduleItem = ({ original, draggableProps }: ScheduleItemComponentProps<{ name: string }>) => {
    return (
        <div
            style={{
                height: '100%',
                width: '100%',
                border: '1px solid #000',
                backgroundColor: '#fca5a5'
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    height: '20px',
                    width: '20px',
                    cursor: 'move',
                    borderRadius: '9999px',
                    backgroundColor: '#6ee7b7'
                }}
                {...draggableProps?.attributes}
                {...draggableProps?.listeners}
            ></div>
            <p>{original.name}</p>
        </div>
    )
}
