export function formatDateToShortString(dateInput: string | Date): string {
  const date = new Date(dateInput);

  // Check for invalid dates
  if (isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}
