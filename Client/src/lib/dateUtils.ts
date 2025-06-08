export function formatDateTime(input: string | Date | null | undefined): string {
    if (!input) return "-";
    const date = typeof input === "string" ? new Date(input) : input;
    if (isNaN(date.getTime())) return "-";
  
    const day = date.toLocaleDateString("he-IL");
    const time = date.toLocaleTimeString("he-IL", {
      hour: "2-digit",
      minute: "2-digit",
    });
  
    return `${day} ${time}`;
  }
  