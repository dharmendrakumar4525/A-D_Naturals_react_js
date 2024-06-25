// utils/localStorage.js
export const getLocalStorageData = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error fetching data from local storage:", error);
    return null;
  }
};
