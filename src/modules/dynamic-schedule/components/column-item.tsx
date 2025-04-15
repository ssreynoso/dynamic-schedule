import { BaseItem, DynamicScheduleProps } from '../types'

type Props<T> = {
    item: T & BaseItem
    rowStart: string
    rowEnd: string
    ItemComponent: DynamicScheduleProps<T>['ItemComponent']
}

export const ColumnItem = <T,>({ item, rowStart, rowEnd, ItemComponent }: Props<T>) => {
    return (
        <div
            className='absolute w-full h-full'
            style={{
                gridRowStart: rowStart,
                gridRowEnd: rowEnd,
            }}
        >
            <ItemComponent item={item} className='relative' />
        </div>
    )
}
