import { PropsWithChildren } from 'react'

type Props = PropsWithChildren<{
    rows: number
    style: React.CSSProperties
}>

export const ColumnItemsContainer = (props: Props) => {
    const { style, rows, children } = props

    const styles = {
        ...style,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
    }

    return (
        <div className='absolute top-0 grid h-full w-full grid-cols-1 bg-blue-300/50' style={styles}>
            {children}
        </div>
    )
}
