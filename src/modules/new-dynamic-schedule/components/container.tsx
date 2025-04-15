import { PropsWithChildren } from 'react'
import { Column } from '../types'

type DynamicScheduleContainerProps = PropsWithChildren<{
    columns: Column[]
}>

export const DynamicScheduleContainer = (props: DynamicScheduleContainerProps) => {
    const { children, columns } = props

    const firstColumnWidth = '4rem'
    const styles = {
        gridTemplateColumns: `${firstColumnWidth} repeat(${columns.length}, minmax(18rem, 1fr))`,
    }

    return (
        <div id='dynamic-schedule-container' className='bg-blue-300 w-full h-full grid overflow-x-auto' style={styles}>
            {children}
        </div>
    )
}
