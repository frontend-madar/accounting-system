/**
 * Formats an ISO date string ("2026-06-15") as "15/6/2026",
 * matching the DD/M/YYYY convention used across the vendors table.
 */
export function formatDate(isoDate: string): string {
    const date = new Date(isoDate);

    if (Number.isNaN(date.getTime())) {
        return isoDate;
    }

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}