import { describe, it, expect } from 'vitest';
import { cn, generateUUID, mapToArray } from './utils';

describe('utils', () => {
  describe('cn', () => {
    it('should merge class names', () => {
      const result = cn('px-2', 'py-1');
      expect(result).toBe('px-2 py-1');
    });

    it('should handle conditional classes', () => {
      const result = cn('base-class', true && 'active', false && 'inactive');
      expect(result).toBe('base-class active');
    });

    it('should merge conflicting Tailwind classes', () => {
      const result = cn('px-2', 'px-4');
      expect(result).toBe('px-4');
    });

    it('should handle array of classes', () => {
      const result = cn(['class1', 'class2', 'class3']);
      expect(result).toBe('class1 class2 class3');
    });

    it('should handle objects with boolean values', () => {
      const result = cn({
        'always-active': true,
        'never-active': false,
        'conditionally-active': true,
      });
      expect(result).toBe('always-active conditionally-active');
    });

    it('should handle empty input', () => {
      const result = cn();
      expect(result).toBe('');
    });

    it('should handle null and undefined', () => {
      const result = cn('base', null, undefined, 'end');
      expect(result).toBe('base end');
    });

    it('should handle complex Tailwind merge scenarios', () => {
      const result = cn('text-sm', 'text-base', 'bg-red-500', 'bg-blue-500');
      expect(result).toBe('text-base bg-blue-500');
    });
  });

  describe('generateUUID', () => {
    it('should generate a valid UUID', () => {
      const uuid = generateUUID();
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(uuid).toMatch(uuidRegex);
    });

    it('should generate unique UUIDs', () => {
      const uuid1 = generateUUID();
      const uuid2 = generateUUID();
      const uuid3 = generateUUID();

      expect(uuid1).not.toBe(uuid2);
      expect(uuid2).not.toBe(uuid3);
      expect(uuid1).not.toBe(uuid3);
    });

    it('should return a string', () => {
      const uuid = generateUUID();
      expect(typeof uuid).toBe('string');
    });

    it('should have correct length', () => {
      const uuid = generateUUID();
      expect(uuid).toHaveLength(36);
    });
  });

  describe('mapToArray', () => {
    it('should convert empty Map to empty array', () => {
      const map = new Map<string, number>();
      const result = mapToArray(map);

      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should convert Map with primitive values to array', () => {
      const map = new Map<string, number>([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      const result = mapToArray(map);

      expect(result).toEqual([1, 2, 3]);
    });

    it('should convert Map with string values to array', () => {
      const map = new Map<string, string>([
        ['key1', 'value1'],
        ['key2', 'value2'],
        ['key3', 'value3'],
      ]);
      const result = mapToArray(map);

      expect(result).toEqual(['value1', 'value2', 'value3']);
    });

    it('should convert Map with object values to array', () => {
      interface TestObject {
        id: string;
        name: string;
      }

      const map = new Map<string, TestObject>([
        ['1', { id: '1', name: 'First' }],
        ['2', { id: '2', name: 'Second' }],
      ]);
      const result = mapToArray(map);

      expect(result).toEqual([
        { id: '1', name: 'First' },
        { id: '2', name: 'Second' },
      ]);
    });

    it('should preserve insertion order', () => {
      const map = new Map<string, string>();
      map.set('c', 'third');
      map.set('a', 'first');
      map.set('b', 'second');

      const result = mapToArray(map);

      expect(result).toEqual(['third', 'first', 'second']);
    });

    it('should handle Map with single entry', () => {
      const map = new Map<string, boolean>([['only', true]]);
      const result = mapToArray(map);

      expect(result).toEqual([true]);
    });

    it('should handle Map with complex nested objects', () => {
      const map = new Map<string, { items: number[]; meta: { count: number } }>(
        [
          ['a', { items: [1, 2, 3], meta: { count: 3 } }],
          ['b', { items: [4, 5], meta: { count: 2 } }],
        ]
      );
      const result = mapToArray(map);

      expect(result).toEqual([
        { items: [1, 2, 3], meta: { count: 3 } },
        { items: [4, 5], meta: { count: 2 } },
      ]);
    });

    it('should work with any type parameter', () => {
      type CustomType = { value: number };
      const map = new Map<string, CustomType>([
        ['x', { value: 10 }],
        ['y', { value: 20 }],
      ]);
      const result = mapToArray<CustomType>(map);

      expect(result).toHaveLength(2);
      expect(result[0].value).toBe(10);
      expect(result[1].value).toBe(20);
    });
  });
});
