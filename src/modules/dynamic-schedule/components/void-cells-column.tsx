import { PropsWithChildren } from 'react'

type Props = PropsWithChildren<{
    style: React.CSSProperties
}>

export const VoidCellsColumn = ({ children, style }: Props) => {
    return (
        <div className='grid h-full w-full grid-cols-1' style={style}>
            {children}
        </div>
    )
}
