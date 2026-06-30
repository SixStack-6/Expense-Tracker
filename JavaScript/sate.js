(function () {
  const { isValidTransaction } = window.ExpenseUtils;
  const STORAGE_KEY = "expense_tracker_transactions";
  const THEME_KEY = "expense_tracker_theme";

  let transactions = loadTransactions();
  let editingId = null;
  let filters = {
    search: "",
    type: "all",
    category: "all",
  };

  function loadTransactions() {
    try {
      const rawData = localStorage.getItem(STORAGE_KEY);
      if (!rawData) return [];

      const parsedData = JSON.parse(rawData);
      if (!Array.isArray(parsedData)) return [];

      return parsedData.filter(isValidTransaction);
    } catch (error) {
      console.warn("Stored transaction data was reset because it could not be read.", error);
      return [];
    }
  }

  function saveTransactions(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      if (error.name === "QuotaExceededError") {
        alert("Storage limit reached. Please delete some transactions and try again.");
      } else {
        alert("Transactions could not be saved in this browser.");
      }
      return false;
    }
  }

  function getTransactions() {
    return transactions;
  }

  function setTransactions(nextTransactions) {
    transactions = nextTransactions;
    return saveTransactions(transactions);
  }

  function getEditingId() {
    return editingId;
  }

  function setEditingId(id) {
    editingId = id;
  }

  function getFilters() {
    return filters;
  }

  function setFilters(nextFilters) {
    filters = { ...filters, ...nextFilters };
  }

  function getStoredTheme() {
    try {
      return localStorage.getItem(THEME_KEY) || "light";
    } catch {
      return "light";
    }
  }

  function setStoredTheme(theme) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      console.warn("Theme preference could not be saved in this browser.");
    }
  }

  window.ExpenseState = {
    STORAGE_KEY,
    THEME_KEY,
    loadTransactions,
    saveTransactions,
    getTransactions,
    setTransactions,
    getEditingId,
    setEditingId,
    getFilters,
    setFilters,
    getStoredTheme,
    setStoredTheme,
  };
})();