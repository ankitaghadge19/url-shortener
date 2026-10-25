// Returns a date in YYYY-MM-DD format for the specified number of days ago 
export const getDateBefore = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};