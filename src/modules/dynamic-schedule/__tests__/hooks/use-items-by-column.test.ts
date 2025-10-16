import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useItemsByColumn } from '../../hooks/use-items-by-column';
import type { Item } from '../../types';

interface TestData {
  id: string;
  name: string;
}

describe('useItemsByColumn', () => {
  it('should return empty object for empty items array', () => {
    const { result } = renderHook(() => useItemsByColumn<TestData>([]));

    expect(result.current.itemsByColumn).toEqual({});
  });

  it('should group items by columnId', () => {
    const items: Item<TestData>[] = [
      {
        id: 'item-1',
        columnId: 'col-1',
        rowIndex: 0,
        rowSpan: 1,
        data: { id: '1', name: 'Item 1' },
      },
      {
        id: 'item-2',
        columnId: 'col-1',
        rowIndex: 1,
        rowSpan: 1,
        data: { id: '2', name: 'Item 2' },
      },
      {
        id: 'item-3',
        columnId: 'col-2',
        rowIndex: 0,
        rowSpan: 1,
        data: { id: '3', name: 'Item 3' },
      },
    ];

    const { result } = renderHook(() => useItemsByColumn(items));

    expect(result.current.itemsByColumn).toEqual({
      'col-1': [items[0], items[1]],
      'col-2': [items[2]],
    });
  });

  it('should handle single item per column', () => {
    const items: Item<TestData>[] = [
      {
        id: 'item-1',
        columnId: 'col-1',
        rowIndex: 0,
        rowSpan: 1,
        data: { id: '1', name: 'Item 1' },
      },
      {
        id: 'item-2',
        columnId: 'col-2',
        rowIndex: 0,
        rowSpan: 1,
        data: { id: '2', name: 'Item 2' },
      },
      {
        id: 'item-3',
        columnId: 'col-3',
        rowIndex: 0,
        rowSpan: 1,
        data: { id: '3', name: 'Item 3' },
      },
    ];

    const { result } = renderHook(() => useItemsByColumn(items));

    expect(result.current.itemsByColumn).toEqual({
      'col-1': [items[0]],
      'col-2': [items[1]],
      'col-3': [items[2]],
    });
  });

  it('should handle all items in same column', () => {
    const items: Item<TestData>[] = [
      {
        id: 'item-1',
        columnId: 'col-1',
        rowIndex: 0,
        rowSpan: 1,
        data: { id: '1', name: 'Item 1' },
      },
      {
        id: 'item-2',
        columnId: 'col-1',
        rowIndex: 1,
        rowSpan: 1,
        data: { id: '2', name: 'Item 2' },
      },
      {
        id: 'item-3',
        columnId: 'col-1',
        rowIndex: 2,
        rowSpan: 1,
        data: { id: '3', name: 'Item 3' },
      },
    ];

    const { result } = renderHook(() => useItemsByColumn(items));

    expect(result.current.itemsByColumn).toEqual({
      'col-1': [items[0], items[1], items[2]],
    });
    expect(result.current.itemsByColumn['col-1']).toHaveLength(3);
  });

  it('should preserve item order within columns', () => {
    const items: Item<TestData>[] = [
      {
        id: 'item-1',
        columnId: 'col-1',
        rowIndex: 5,
        rowSpan: 1,
        data: { id: '1', name: 'First' },
      },
      {
        id: 'item-2',
        columnId: 'col-1',
        rowIndex: 2,
        rowSpan: 1,
        data: { id: '2', name: 'Second' },
      },
      {
        id: 'item-3',
        columnId: 'col-1',
        rowIndex: 8,
        rowSpan: 1,
        data: { id: '3', name: 'Third' },
      },
    ];

    const { result } = renderHook(() => useItemsByColumn(items));

    expect(result.current.itemsByColumn['col-1'][0].data.name).toBe('First');
    expect(result.current.itemsByColumn['col-1'][1].data.name).toBe('Second');
    expect(result.current.itemsByColumn['col-1'][2].data.name).toBe('Third');
  });

  it('should handle items with different rowSpan values', () => {
    const items: Item<TestData>[] = [
      {
        id: 'item-1',
        columnId: 'col-1',
        rowIndex: 0,
        rowSpan: 2,
        data: { id: '1', name: 'Item 1' },
      },
      {
        id: 'item-2',
        columnId: 'col-1',
        rowIndex: 2,
        rowSpan: 3,
        data: { id: '2', name: 'Item 2' },
      },
    ];

    const { result } = renderHook(() => useItemsByColumn(items));

    expect(result.current.itemsByColumn['col-1']).toHaveLength(2);
    expect(result.current.itemsByColumn['col-1'][0].rowSpan).toBe(2);
    expect(result.current.itemsByColumn['col-1'][1].rowSpan).toBe(3);
  });

  it('should update when items array changes', () => {
    const initialItems: Item<TestData>[] = [
      {
        id: 'item-1',
        columnId: 'col-1',
        rowIndex: 0,
        rowSpan: 1,
        data: { id: '1', name: 'Item 1' },
      },
    ];

    const { result, rerender } = renderHook(
      ({ items }) => useItemsByColumn(items),
      { initialProps: { items: initialItems } }
    );

    expect(result.current.itemsByColumn['col-1']).toHaveLength(1);

    const updatedItems: Item<TestData>[] = [
      ...initialItems,
      {
        id: 'item-2',
        columnId: 'col-1',
        rowIndex: 1,
        rowSpan: 1,
        data: { id: '2', name: 'Item 2' },
      },
    ];

    rerender({ items: updatedItems });

    expect(result.current.itemsByColumn['col-1']).toHaveLength(2);
  });

  it('should handle generic data types', () => {
    interface CustomData {
      title: string;
      value: number;
      active: boolean;
    }

    const items: Item<CustomData>[] = [
      {
        id: 'item-1',
        columnId: 'col-1',
        rowIndex: 0,
        rowSpan: 1,
        data: { title: 'Test', value: 42, active: true },
      },
    ];

    const { result } = renderHook(() => useItemsByColumn(items));

    expect(result.current.itemsByColumn['col-1'][0].data.title).toBe('Test');
    expect(result.current.itemsByColumn['col-1'][0].data.value).toBe(42);
    expect(result.current.itemsByColumn['col-1'][0].data.active).toBe(true);
  });
});
