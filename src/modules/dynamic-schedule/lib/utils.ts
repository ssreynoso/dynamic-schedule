import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const generateUUID = () => crypto.randomUUID()

/**
 * Converts a Map to an array of its values
 * @param map - The Map to convert
 * @returns Array of values from the Map
 */
export const mapToArray = <T>(map: Map<string, T>): T[] => Array.from(map.values())
