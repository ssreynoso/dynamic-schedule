import { PropsWithChildren } from 'react'

export const DynamicScheduleColumn = (props: PropsWithChildren) => {
    const { children } = props

    return <div className='relative h-full w-full'>{children}</div>
}
