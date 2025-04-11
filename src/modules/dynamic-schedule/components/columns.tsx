import { PropsWithChildren } from 'react'

type Props = PropsWithChildren<{
    style: React.CSSProperties
}>

export const DynamicScheduleColumns = (props: Props) => {
    const { style, children } = props

    return (
        <div className='relative grid h-auto w-full' style={style}>
            {children}
        </div>
    )
}
