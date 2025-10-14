import { Column, Row } from '../types'

/**
 * Calculates pixel position from grid indices
 */
export interface CalculatePixelPositionInput {
    columnIndex: number
    rowIndex: number
    columnWidth: number
    rowHeight: number
}

export const calculatePixelPosition = (input: CalculatePixelPositionInput) => {
    const { columnIndex, rowIndex, columnWidth, rowHeight } = input
    return {
        x: columnIndex * columnWidth,
        y: rowIndex * rowHeight
    }
}

/**
 * Calculates grid position from pixel coordinates
 */
export interface CalculateGridPositionInput {
    pixelX: number
    pixelY: number
    columnWidth: number
    rowHeight: number
}

export const calculateGridPosition = (input: CalculateGridPositionInput) => {
    const { pixelX, pixelY, columnWidth, rowHeight } = input
    return {
        columnIndex: Math.floor(pixelX / columnWidth),
        rowIndex: Math.floor(pixelY / rowHeight)
    }
}

/**
 * Calculates the delta (difference) between two positions
 */
export interface CalculateMovementDeltaInput {
    fromColumnIndex: number
    fromRowIndex: number
    toColumnIndex: number
    toRowIndex: number
}

export const calculateMovementDelta = (input: CalculateMovementDeltaInput) => {
    const { fromColumnIndex, fromRowIndex, toColumnIndex, toRowIndex } = input
    return {
        deltaColumn: toColumnIndex - fromColumnIndex,
        deltaRow: toRowIndex - fromRowIndex
    }
}

/**
 * Validates if a position is within bounds
 */
export interface ValidatePositionBoundsInput {
    columnIndex: number
    rowIndex: number
    columns: Column[]
    rows: Row[]
}

export const validatePositionBounds = (input: ValidatePositionBoundsInput): boolean => {
    const { columnIndex, rowIndex, columns, rows } = input
    return (
        columnIndex >= 0 &&
        columnIndex < columns.length &&
        rowIndex >= 0 &&
        rowIndex < rows.length
    )
}

/**
 * Calculates relative position between two DOMRects
 */
export interface CalculateRelativePositionInput {
    targetRect: DOMRect
    baseRect: DOMRect
}

export const calculateRelativePosition = (input: CalculateRelativePositionInput) => {
    const { targetRect, baseRect } = input
    return {
        top: targetRect.top - baseRect.top,
        left: targetRect.left - baseRect.left
    }
}

/**
 * Checks if there's any movement (delta is not zero)
 */
export interface HasMovementInput {
    deltaColumn: number
    deltaRow: number
}

export const hasMovement = (input: HasMovementInput): boolean => {
    const { deltaColumn, deltaRow } = input
    return deltaColumn !== 0 || deltaRow !== 0
}
