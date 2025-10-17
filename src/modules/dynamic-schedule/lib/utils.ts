export function cn(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(' ')
}

export const generateUUID = () => crypto.randomUUID()

/**
 * Converts a Map to an array of its values
 * @param map - The Map to convert
 * @returns Array of values from the Map
 */
export const mapToArray = <T>(map: Map<string, T>): T[] => Array.from(map.values())
