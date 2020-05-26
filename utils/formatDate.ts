export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function formatDate(date: string): string {
  if (!date) {
    return "";
  }
  const parts = date.split(/[-T:Z]/).map((s) => parseInt(s, 10));
  const timestamp = `${MONTHS[parts[1] - 1]} ${parts[2]}, ${parts[0]}`;
  return timestamp;
}

export function year(date: string): string {
  if (!date) {
    return "";
  }

  const [year] = date.toString().split("-");
  return year;
}
