import { useState } from 'react'
import { DynamicSchedule } from './modules/dynamic-schedule'

function App() {
    const columns = [
        { id: 1, label: 'Lunes' },
        { id: 2, label: 'Martes' },
        { id: 3, label: 'Miércoles' },
        { id: 4, label: 'Jueves' },
        { id: 5, label: 'Viernes' },
    ]

    const horarios = [
        { id: 0, label: '08:00 - 09:00' },
        { id: 1, label: '09:00 - 10:00' },
        { id: 2, label: '10:00 - 11:00' },
        { id: 3, label: '11:00 - 12:00' },
        { id: 4, label: '12:00 - 13:00' },
        { id: 5, label: '13:00 - 14:00' },
    ]

    const [scheduleItems, setScheduleItems] = useState([
        { id: 0, columnId: 1, rowId: 1, rowSpan: 1 },
        { id: 1, columnId: 2, rowId: 2, rowSpan: 2 },
        { id: 2, columnId: 3, rowId: 3, rowSpan: 3 },
        { id: 3, columnId: 1, rowId: 1, rowSpan: 3 },
    ])

    return (
        <div className='container h-screen mx-auto'>
            <DynamicSchedule
                columns={columns}
                rows={horarios}
                scheduleItems={scheduleItems}
                setScheduleItems={setScheduleItems}
                yAxisLabel='Horarios'
                rowHeight={100}
                minColumnWidth={300}
                linesPerRow={1}
                ItemComponent={(props) => {
                    return <div className='bg-red-300 w-full h-full'></div>
                }}
                VoidItemComponent={() => {
                    return (
                        <div className='bg-slate-300'>
                            <p>void</p>
                        </div>
                    )
                }}
            />
        </div>
    )
}

export default App
