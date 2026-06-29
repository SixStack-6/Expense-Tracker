(function () {
  const CATEGORIES = {
    income: ["Salary", "Freelance", "Investment", "Gift", "Other"],
    expense: ["Food", "Transport", "Housing", "Entertainment", "Health", "Shopping", "Utilities", "Education", "Other"],
  };

  const ALL_CATEGORIES = [...new Set([...CATEGORIES.income, ...CATEGORIES.expense])].sort();

  function todayISO() {
    return new Date().toISOString().slice(0, 10);
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  }

  function formatDate(dateValue) {
    return new Intl.DateTimeFormat(navigator.language || "en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(`${dateValue}T00:00:00`));
  }

  function createId(existingIds = []) {
    let id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    while (existingIds.includes(id)) {
      id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }

    return id;
  }

  function escapeHTML(value) {
    const element = document.createElement("span");
    element.textContent = value;
    return element.innerHTML;
  }

  function normalizeTransactionInput(input) {
    return {
      label: input.label.trim(),
      amount: Number(Number(input.amount).toFixed(2)),
      type: input.type,
      category: input.category,
      date: input.date || todayISO(),
    };
  }

  function validateTransaction(input) {
    const errors = {};
    const label = input.label.trim();
    const amountText = String(input.amount).trim();
    const amount = Number(amountText);

    if (!label) {
      errors.label = "Label is required.";
    } else if (label.length > 50) {
      errors.label = "Label must be 50 characters or less.";
    }

    if (!amountText) {
      errors.amount = "Amount is required.";
    } else if (!Number.isFinite(amount) || amount <= 0) {
      errors.amount = "Enter a positive amount.";
    } else if (!/^\d+(\.\d{1,2})?$/.test(amountText)) {
      errors.amount = "Use maximum 2 decimal places.";
    }

    if (!["income", "expense"].includes(input.type)) {
      errors.type = "Choose income or expense.";
    }

    if (!CATEGORIES[input.type] || !CATEGORIES[input.type].includes(input.category)) {
      errors.category = "Choose a valid category.";
    }

    if (input.date && Number.isNaN(new Date(`${input.date}T00:00:00`).getTime())) {
      errors.date = "Choose a valid date.";
    }

    return errors;
  }

  function isValidTransaction(transaction) {
    return (
      transaction &&
      typeof transaction.id === "string" &&
      typeof transaction.label === "string" &&
      typeof transaction.amount === "number" &&
      Number.isFinite(transaction.amount) &&
      ["income", "expense"].includes(transaction.type) &&
      CATEGORIES[transaction.type].includes(transaction.category) &&
      typeof transaction.date === "string" &&
      typeof transaction.createdAt === "number"
    );
  }

  window.ExpenseUtils = {
    CATEGORIES,
    ALL_CATEGORIES,
    todayISO,
    formatCurrency,
    formatDate,
    createId,
    escapeHTML,
    normalizeTransactionInput,
    validateTransaction,
    isValidTransaction,
  };
})();