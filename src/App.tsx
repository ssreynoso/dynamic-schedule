import { useState } from 'react'
import { DynamicSchedule } from './modules/new-dynamic-schedule/components'

function App() {
    const columns = [
        { id: '1', label: 'Quirófano 1' },
        { id: '2', label: 'Quirófano 2' },
        { id: '3', label: 'Quirófano 3' },
        { id: '4', label: 'Quirófano 4' },
        { id: '5', label: 'Quirófano 5' },
        { id: '6', label: 'Quirófano 6' },
        { id: '7', label: 'Quirófano 7' },
    ]

    const horarios = [
        { id: '0', label: '00:00' },
        { id: '1', label: '01:00' },
        { id: '2', label: '02:00' },
        { id: '3', label: '03:00' },
        { id: '4', label: '04:00' },
        { id: '5', label: '05:00' },
        { id: '6', label: '06:00' },
        { id: '7', label: '07:00' },
        { id: '8', label: '08:00' },
        { id: '9', label: '09:00' },
        { id: '10', label: '10:00' },
        { id: '11', label: '11:00' },
        { id: '12', label: '12:00' },
        { id: '13', label: '13:00' },
        { id: '14', label: '14:00' },
        { id: '15', label: '15:00' },
        { id: '16', label: '16:00' },
        { id: '17', label: '17:00' },
        { id: '18', label: '18:00' },
        { id: '19', label: '19:00' },
        { id: '20', label: '20:00' },
        { id: '21', label: '21:00' },
        { id: '22', label: '22:00' },
        { id: '23', label: '23:00' },
    ]

    const [scheduleItems, setScheduleItems] = useState([
        { id: '0', columnId: '1', rowStart: 1, rowSpan: 2, original: { name: '1' } },
        { id: '3', columnId: '1', rowStart: 1, rowSpan: 2, original: { name: '2' } },
        { id: '4', columnId: '1', rowStart: 2, rowSpan: 5, original: { name: '3' } },
        { id: '5', columnId: '1', rowStart: 3, rowSpan: 2, original: { name: '4' } },
        { id: '6', columnId: '1', rowStart: 2, rowSpan: 4, original: { name: '5' } },
        { id: '1', columnId: '2', rowStart: 2, rowSpan: 2, original: { name: 'Juan' } },
        { id: '2', columnId: '3', rowStart: 3, rowSpan: 3, original: { name: 'Pepe' } },
    ])

    return (
        <div className='container h-screen mx-auto'>
            {/* <DynamicSchedule
                columns={columns}
                rows={horarios}
                scheduleItems={scheduleItems}
                setScheduleItems={setScheduleItems}
                yAxisLabel='Horarios'
                rowHeight={100}
                minColumnWidth={300}
                linesPerRow={1}
                headerStyles={{ backgroundColor: '#458fA3' }}
                ItemComponent={(props) => {
                    return <div className='bg-red-300 w-full h-full border'></div>
                }}
                VoidItemComponent={() => {
                    return (
                        <div className='bg-slate-300'>
                            <p>void</p>
                        </div>
                    )
                }}
            /> */}
            <DynamicSchedule
                items={scheduleItems}
                columns={columns}
                rows={horarios}
                ScheduleItemComponent={({ original }) => {
                    return (
                        <div className='bg-red-300 w-full h-full border'>
                            <p>{original.name}</p>
                        </div>
                    )
                }}
            />
        </div>
    )
}

export default App
