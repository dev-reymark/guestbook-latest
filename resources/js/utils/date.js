export function formatLocalDateTime(dateString) {
    if (!dateString) return "";

    const date = new Date(dateString);

    const options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
        timeZone: "Asia/Manila",
    };

    return date.toLocaleString("en-US", options);
}
