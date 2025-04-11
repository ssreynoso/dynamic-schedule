import { calculateVoidCells } from '../lib/calculate-void-cells'
import { Column, DynamicScheduleProps } from '../types'

import { VoidCell } from './void-cell'

type Props<T> = Pick<DynamicScheduleProps<T>, 'rows' | 'VoidItemComponent' | 'ItemComponent'> & {
    column: Column
}

export const VoidCells = <T,>(props: Props<T>) => {
    const { rows, column, VoidItemComponent } = props

    const voidCells = calculateVoidCells({ rows })

    return (
        <>
            {voidCells.map((cell) => (
                <VoidCell key={`void-${cell.row.id}-${column.id}`} column={column} cell={cell} VoidItemComponent={VoidItemComponent} />
            ))}
        </>
    )
}
