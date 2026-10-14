// Returns a date in YYYY-MM-DD format for the specified number of days ago 
export const getDateBefore = (days) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split("T")[0];
};