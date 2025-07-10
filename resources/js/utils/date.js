export function formatLocalDateTime(utcDateString) {
    if (!utcDateString) return "";

    const date = new Date(utcDateString);

    return date.toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
}
