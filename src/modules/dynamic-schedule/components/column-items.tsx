import { DynamicScheduleProps } from '../types'

import { ColumnItem } from './column-item'

type Props<T> = Pick<DynamicScheduleProps<T>, 'ItemComponent'> & {
    columnItems: DynamicScheduleProps<T>['scheduleItems']
}

export const ColumnItems = <T,>(props: Props<T>) => {
    const { ItemComponent, columnItems } = props

    return (
        <>
            {columnItems.map((item) => {
                const rowStart = item.rowId
                const rowEnd = item.rowId + item.rowSpan

                console.log('item', item)

                return (
                    <ColumnItem<T>
                        item={item}
                        key={`item-${item.id}-${item.columnId}-${item.rowId}`}
                        rowStart={rowStart.toString()}
                        rowEnd={rowEnd.toString()}
                        ItemComponent={ItemComponent}
                    />
                )
            })}
        </>
    )
}
