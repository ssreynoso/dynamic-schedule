import { useCallback, useEffect, useMemo, useState } from 'react'
import { DynamicSchedule } from './modules/dynamic-schedule/components'
import { DynamicScheduleOnChangeCallback } from './modules/dynamic-schedule/types'
import { ScheduleVoidItem } from './schedule-void-item'
import { ScheduleItem } from './schedule-item'

function App() {
    const columns = useMemo(() => {
        return [
            { id: '1', label: 'Columna 1' },
            { id: '2', label: 'Columna 2' },
            { id: '3', label: 'Columna 3' },
            { id: '4', label: 'Columna 4' },
            { id: '5', label: 'Columna 5' },
            { id: '6', label: 'Columna 6' },
            { id: '7', label: 'Columna 7' },
        ]
    }, [])

    const horarios = useMemo(() => {
        return [
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
    }, [])

    const [scheduleItems, setScheduleItems] = useState([
        { id: '0', columnId: '1', rowStart: 1, rowSpan: 2, original: { name: '1' } },
        { id: '3', columnId: '1', rowStart: 1, rowSpan: 2, original: { name: '2' } },
        { id: '4', columnId: '1', rowStart: 2, rowSpan: 5, original: { name: '3' } },
        { id: '5', columnId: '1', rowStart: 3, rowSpan: 2, original: { name: '4' } },
        { id: '6', columnId: '1', rowStart: 2, rowSpan: 4, original: { name: '5' } },
        { id: '1', columnId: '2', rowStart: 2, rowSpan: 2, original: { name: '6' } },
        { id: '2', columnId: '3', rowStart: 3, rowSpan: 3, original: { name: '7' } },
    ])

    const firstColumnWidth = 64
    const headerHeight = 40
    const rowHeight = 100
    const minColumnWidth = 300

    const [scrollIndicator, setScrollIndicator] = useState({
        quantity: 0,
        autoScroll: false,
    })

    useEffect(() => {
        const interval = setInterval(() => {
            setScrollIndicator((prev) => ({ ...prev, quantity: prev.quantity + 2 }))
        }, 1000)

        return () => {
            clearInterval(interval)
        }
    }, [])

    const handleChange = useCallback<DynamicScheduleOnChangeCallback<{ name: string }>>(({ items }) => {
        console.log('items', items)

        setScheduleItems((prevItems) => {
            const newItems = [...prevItems]
            const newScheduleItems = items.map((item) => item.newScheduleItem)
            newScheduleItems.forEach((item) => {
                const index = newItems.findIndex((i) => i.id === item.id)

                if (index !== -1) {
                    newItems[index] = item
                } else {
                    newItems.push(item)
                }
            })

            return newItems
        })

        const promise = new Promise<void>((resolve) => setTimeout(resolve, 0))

        return promise
    }, [])

    return (
        <div className='container h-screen mx-auto'>
            <DynamicSchedule
                scrollIndicator={scrollIndicator}
                firstColumnWidth={firstColumnWidth}
                headerHeight={headerHeight}
                rowHeight={rowHeight}
                minColumnWidth={minColumnWidth}
                items={scheduleItems}
                columns={columns}
                rows={horarios}
                VoidItemComponent={ScheduleVoidItem}
                ScheduleItemComponent={ScheduleItem}
                onChange={handleChange}
                firstColumnText='Horarios'
                firstColumnClassName='bg-gray-200'
                headerClassName='bg-gray-200'
            />
        </div>
    )
}

export default App
