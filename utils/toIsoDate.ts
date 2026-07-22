export function toIsoDate(dateStr: string): string {
    return new Date(dateStr).toISOString();
}