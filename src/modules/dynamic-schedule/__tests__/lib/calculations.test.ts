import { describe, it, expect } from 'vitest';
import {
  calculatePixelPosition,
  calculateGridPosition,
  calculateMovementDelta,
  validatePositionBounds,
  calculateRelativePosition,
  hasMovement,
} from '../../lib/calculations';
import type { Column, Row } from '../../types';

describe('calculations', () => {
  describe('calculatePixelPosition', () => {
    it('should calculate pixel position from grid indices at origin', () => {
      const result = calculatePixelPosition({
        columnIndex: 0,
        rowIndex: 0,
        columnWidth: 100,
        rowHeight: 50,
      });

      expect(result).toEqual({ x: 0, y: 0 });
    });

    it('should calculate pixel position for positive indices', () => {
      const result = calculatePixelPosition({
        columnIndex: 3,
        rowIndex: 5,
        columnWidth: 100,
        rowHeight: 50,
      });

      expect(result).toEqual({ x: 300, y: 250 });
    });

    it('should handle different cell dimensions', () => {
      const result = calculatePixelPosition({
        columnIndex: 2,
        rowIndex: 4,
        columnWidth: 75,
        rowHeight: 40,
      });

      expect(result).toEqual({ x: 150, y: 160 });
    });

    it('should handle zero dimensions', () => {
      const result = calculatePixelPosition({
        columnIndex: 5,
        rowIndex: 3,
        columnWidth: 0,
        rowHeight: 0,
      });

      expect(result).toEqual({ x: 0, y: 0 });
    });
  });

  describe('calculateGridPosition', () => {
    it('should calculate grid position from pixel coordinates at origin', () => {
      const result = calculateGridPosition({
        pixelX: 0,
        pixelY: 0,
        columnWidth: 100,
        rowHeight: 50,
      });

      expect(result).toEqual({ columnIndex: 0, rowIndex: 0 });
    });

    it('should calculate grid position for positive pixels', () => {
      const result = calculateGridPosition({
        pixelX: 350,
        pixelY: 275,
        columnWidth: 100,
        rowHeight: 50,
      });

      expect(result).toEqual({ columnIndex: 3, rowIndex: 5 });
    });

    it('should floor decimal values', () => {
      const result = calculateGridPosition({
        pixelX: 149,
        pixelY: 99,
        columnWidth: 100,
        rowHeight: 50,
      });

      expect(result).toEqual({ columnIndex: 1, rowIndex: 1 });
    });

    it('should handle negative pixel values', () => {
      const result = calculateGridPosition({
        pixelX: -50,
        pixelY: -25,
        columnWidth: 100,
        rowHeight: 50,
      });

      expect(result).toEqual({ columnIndex: -1, rowIndex: -1 });
    });

    it('should handle pixels exactly on grid lines', () => {
      const result = calculateGridPosition({
        pixelX: 200,
        pixelY: 100,
        columnWidth: 100,
        rowHeight: 50,
      });

      expect(result).toEqual({ columnIndex: 2, rowIndex: 2 });
    });
  });

  describe('calculateMovementDelta', () => {
    it('should calculate zero delta for no movement', () => {
      const result = calculateMovementDelta({
        fromColumnIndex: 2,
        fromRowIndex: 3,
        toColumnIndex: 2,
        toRowIndex: 3,
      });

      expect(result).toEqual({ deltaColumn: 0, deltaRow: 0 });
    });

    it('should calculate positive delta for forward movement', () => {
      const result = calculateMovementDelta({
        fromColumnIndex: 1,
        fromRowIndex: 2,
        toColumnIndex: 4,
        toRowIndex: 5,
      });

      expect(result).toEqual({ deltaColumn: 3, deltaRow: 3 });
    });

    it('should calculate negative delta for backward movement', () => {
      const result = calculateMovementDelta({
        fromColumnIndex: 5,
        fromRowIndex: 4,
        toColumnIndex: 2,
        toRowIndex: 1,
      });

      expect(result).toEqual({ deltaColumn: -3, deltaRow: -3 });
    });

    it('should calculate mixed delta', () => {
      const result = calculateMovementDelta({
        fromColumnIndex: 3,
        fromRowIndex: 1,
        toColumnIndex: 1,
        toRowIndex: 4,
      });

      expect(result).toEqual({ deltaColumn: -2, deltaRow: 3 });
    });

    it('should handle movement only in one axis (horizontal)', () => {
      const result = calculateMovementDelta({
        fromColumnIndex: 0,
        fromRowIndex: 2,
        toColumnIndex: 5,
        toRowIndex: 2,
      });

      expect(result).toEqual({ deltaColumn: 5, deltaRow: 0 });
    });

    it('should handle movement only in one axis (vertical)', () => {
      const result = calculateMovementDelta({
        fromColumnIndex: 3,
        fromRowIndex: 0,
        toColumnIndex: 3,
        toRowIndex: 7,
      });

      expect(result).toEqual({ deltaColumn: 0, deltaRow: 7 });
    });
  });

  describe('validatePositionBounds', () => {
    const mockColumns: Column[] = [
      { id: '1', label: 'Col 1' },
      { id: '2', label: 'Col 2' },
      { id: '3', label: 'Col 3' },
    ];

    const mockRows: Row[] = [
      { id: '1', label: 'Row 1' },
      { id: '2', label: 'Row 2' },
      { id: '3', label: 'Row 3' },
      { id: '4', label: 'Row 4' },
    ];

    it('should return true for valid position at origin', () => {
      const result = validatePositionBounds({
        columnIndex: 0,
        rowIndex: 0,
        columns: mockColumns,
        rows: mockRows,
      });

      expect(result).toBe(true);
    });

    it('should return true for valid position in bounds', () => {
      const result = validatePositionBounds({
        columnIndex: 1,
        rowIndex: 2,
        columns: mockColumns,
        rows: mockRows,
      });

      expect(result).toBe(true);
    });

    it('should return true for position at maximum bounds', () => {
      const result = validatePositionBounds({
        columnIndex: 2,
        rowIndex: 3,
        columns: mockColumns,
        rows: mockRows,
      });

      expect(result).toBe(true);
    });

    it('should return false for negative column index', () => {
      const result = validatePositionBounds({
        columnIndex: -1,
        rowIndex: 0,
        columns: mockColumns,
        rows: mockRows,
      });

      expect(result).toBe(false);
    });

    it('should return false for negative row index', () => {
      const result = validatePositionBounds({
        columnIndex: 0,
        rowIndex: -1,
        columns: mockColumns,
        rows: mockRows,
      });

      expect(result).toBe(false);
    });

    it('should return false for column index exceeding bounds', () => {
      const result = validatePositionBounds({
        columnIndex: 3,
        rowIndex: 0,
        columns: mockColumns,
        rows: mockRows,
      });

      expect(result).toBe(false);
    });

    it('should return false for row index exceeding bounds', () => {
      const result = validatePositionBounds({
        columnIndex: 0,
        rowIndex: 4,
        columns: mockColumns,
        rows: mockRows,
      });

      expect(result).toBe(false);
    });

    it('should return false for both indices out of bounds', () => {
      const result = validatePositionBounds({
        columnIndex: 10,
        rowIndex: 20,
        columns: mockColumns,
        rows: mockRows,
      });

      expect(result).toBe(false);
    });

    it('should return false for empty columns array', () => {
      const result = validatePositionBounds({
        columnIndex: 0,
        rowIndex: 0,
        columns: [],
        rows: mockRows,
      });

      expect(result).toBe(false);
    });

    it('should return false for empty rows array', () => {
      const result = validatePositionBounds({
        columnIndex: 0,
        rowIndex: 0,
        columns: mockColumns,
        rows: [],
      });

      expect(result).toBe(false);
    });
  });

  describe('calculateRelativePosition', () => {
    it('should calculate zero relative position for identical rects', () => {
      const rect = new DOMRect(100, 50, 200, 150);
      const result = calculateRelativePosition({
        targetRect: rect,
        baseRect: rect,
      });

      expect(result).toEqual({ top: 0, left: 0 });
    });

    it('should calculate positive relative position', () => {
      const targetRect = new DOMRect(150, 100, 200, 150);
      const baseRect = new DOMRect(50, 30, 200, 150);
      const result = calculateRelativePosition({
        targetRect,
        baseRect,
      });

      expect(result).toEqual({ top: 70, left: 100 });
    });

    it('should calculate negative relative position', () => {
      const targetRect = new DOMRect(50, 30, 200, 150);
      const baseRect = new DOMRect(150, 100, 200, 150);
      const result = calculateRelativePosition({
        targetRect,
        baseRect,
      });

      expect(result).toEqual({ top: -70, left: -100 });
    });

    it('should handle rects at origin', () => {
      const targetRect = new DOMRect(0, 0, 100, 100);
      const baseRect = new DOMRect(50, 50, 100, 100);
      const result = calculateRelativePosition({
        targetRect,
        baseRect,
      });

      expect(result).toEqual({ top: -50, left: -50 });
    });

    it('should only use top and left, ignoring width and height', () => {
      const targetRect = new DOMRect(100, 200, 500, 600);
      const baseRect = new DOMRect(20, 40, 10, 10);
      const result = calculateRelativePosition({
        targetRect,
        baseRect,
      });

      expect(result).toEqual({ top: 160, left: 80 });
    });
  });

  describe('hasMovement', () => {
    it('should return false for no movement', () => {
      const result = hasMovement({ deltaColumn: 0, deltaRow: 0 });
      expect(result).toBe(false);
    });

    it('should return true for horizontal movement only', () => {
      const result = hasMovement({ deltaColumn: 3, deltaRow: 0 });
      expect(result).toBe(true);
    });

    it('should return true for vertical movement only', () => {
      const result = hasMovement({ deltaColumn: 0, deltaRow: 5 });
      expect(result).toBe(true);
    });

    it('should return true for diagonal movement', () => {
      const result = hasMovement({ deltaColumn: 2, deltaRow: 3 });
      expect(result).toBe(true);
    });

    it('should return true for negative horizontal movement', () => {
      const result = hasMovement({ deltaColumn: -1, deltaRow: 0 });
      expect(result).toBe(true);
    });

    it('should return true for negative vertical movement', () => {
      const result = hasMovement({ deltaColumn: 0, deltaRow: -2 });
      expect(result).toBe(true);
    });

    it('should return true for negative diagonal movement', () => {
      const result = hasMovement({ deltaColumn: -3, deltaRow: -4 });
      expect(result).toBe(true);
    });

    it('should return true for mixed sign movement', () => {
      const result = hasMovement({ deltaColumn: -2, deltaRow: 5 });
      expect(result).toBe(true);
    });
  });
});
