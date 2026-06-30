(function () {
  const { getFilters, getTransactions, setEditingId } = window.ExpenseState;
  const { ALL_CATEGORIES, CATEGORIES, escapeHTML, formatCurrency, formatDate, todayISO } = window.ExpenseUtils;

  const elements = {
    balanceAmount: document.querySelector("#balanceAmount"),
    incomeAmount: document.querySelector("#incomeAmount"),
    expenseAmount: document.querySelector("#expenseAmount"),
    transactionList: document.querySelector("#transactionList"),
    transactionForm: document.querySelector("#transactionForm"),
    formTitle: document.querySelector("#formTitle"),
    labelInput: document.querySelector("#labelInput"),
    amountInput: document.querySelector("#amountInput"),
    categoryInput: document.querySelector("#categoryInput"),
    categoryFilter: document.querySelector("#categoryFilter"),
    dateInput: document.querySelector("#dateInput"),
    submitBtn: document.querySelector("#submitBtn"),
    cancelEditBtn: document.querySelector("#cancelEditBtn"),
    formMessage: document.querySelector("#formMessage"),
    themeIcon: document.querySelector("#themeIcon"),
    labelError: document.querySelector("#labelError"),
    amountError: document.querySelector("#amountError"),
    categoryError: document.querySelector("#categoryError"),
    dateError: document.querySelector("#dateError"),
  };

  function getElements() {
    return elements;
  }

  function calculateTotals() {
    const totals = getTransactions().reduce(
      (result, transaction) => {
        if (transaction.type === "income") {
          result.income += transaction.amount;
        } else {
          result.expense += transaction.amount;
        }
        return result;
      },
      { income: 0, expense: 0, balance: 0 }
    );

    totals.balance = totals.income - totals.expense;
    return totals;
  }

  function getVisibleTransactions() {
    const { search, type, category } = getFilters();

    return getTransactions()
      .filter((transaction) => {
        const matchesSearch = transaction.label.toLowerCase().includes(search.toLowerCase());
        const matchesType = type === "all" || transaction.type === type;
        const matchesCategory = category === "all" || transaction.category === category;

        return matchesSearch && matchesType && matchesCategory;
      })
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  function renderSummary() {
    const totals = calculateTotals();

    elements.balanceAmount.textContent = formatCurrency(totals.balance);
    elements.incomeAmount.textContent = formatCurrency(totals.income);
    elements.expenseAmount.textContent = formatCurrency(totals.expense);
    elements.balanceAmount.classList.toggle("negative", totals.balance < 0);
  }

  function renderTransactions() {
    const visibleTransactions = getVisibleTransactions();
    const allTransactions = getTransactions();

    if (!allTransactions.length) {
      elements.transactionList.innerHTML = '<p class="empty-state">No transactions yet. Add your first entry above!</p>';
      return;
    }

    if (!visibleTransactions.length) {
      elements.transactionList.innerHTML = '<p class="empty-state">No transactions match your filters.</p>';
      return;
    }

    elements.transactionList.innerHTML = visibleTransactions
      .map((transaction) => {
        const sign = transaction.type === "income" ? "+" : "-";
        const typeLabel = transaction.type === "income" ? "Income" : "Expense";

        return `
          <article class="transaction-item ${transaction.type}">
            <div class="transaction-main">
              <div class="transaction-title-row">
                <strong title="${escapeHTML(transaction.label)}">${escapeHTML(transaction.label)}</strong>
                <span class="type-pill">${typeLabel}</span>
              </div>
              <div class="transaction-meta">
                <span>${escapeHTML(transaction.category)}</span>
                <span>${formatDate(transaction.date)}</span>
              </div>
            </div>
            <strong class="transaction-amount">${sign}${formatCurrency(transaction.amount)}</strong>
            <div class="transaction-actions">
              <button class="small-button" type="button" data-action="edit" data-id="${transaction.id}" aria-label="Edit ${escapeHTML(
          transaction.label
        )}">Edit</button>
              <button class="small-danger-button" type="button" data-action="delete" data-id="${transaction.id}" aria-label="Delete ${escapeHTML(
          transaction.label
        )}">Delete</button>
            </div>
          </article>
        `;
      })
      .join("");
  }

  function renderCategoryOptions(type) {
    elements.categoryInput.innerHTML = CATEGORIES[type].map((category) => `<option value="${category}">${category}</option>`).join("");
  }

  function renderCategoryFilter() {
    elements.categoryFilter.innerHTML =
      '<option value="all">All categories</option>' +
      ALL_CATEGORIES.map((category) => `<option value="${category}">${category}</option>`).join("");
  }

  function renderFormErrors(errors = {}) {
    elements.labelError.textContent = errors.label || "";
    elements.amountError.textContent = errors.amount || "";
    elements.categoryError.textContent = errors.category || "";
    elements.dateError.textContent = errors.date || "";
  }

  function resetForm() {
    elements.transactionForm.reset();
    elements.dateInput.value = todayISO();
    renderCategoryOptions("income");
    renderFormErrors();
    setEditingId(null);
    elements.formTitle.textContent = "Add New Transaction";
    elements.submitBtn.textContent = "Add Transaction";
    elements.cancelEditBtn.classList.add("hidden");
  }

  function fillFormForEdit(transaction) {
    elements.labelInput.value = transaction.label;
    elements.amountInput.value = transaction.amount.toFixed(2);
    elements.dateInput.value = transaction.date;
    document.querySelector(`input[name="type"][value="${transaction.type}"]`).checked = true;
    renderCategoryOptions(transaction.type);
    elements.categoryInput.value = transaction.category;
    elements.formTitle.textContent = "Edit Transaction";
    elements.submitBtn.textContent = "Update Transaction";
    elements.cancelEditBtn.classList.remove("hidden");
    setEditingId(transaction.id);
    elements.labelInput.focus();
  }

  function showFormMessage(message) {
    elements.formMessage.textContent = message;
    window.setTimeout(() => {
      if (elements.formMessage.textContent === message) {
        elements.formMessage.textContent = "";
      }
    }, 1800);
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    elements.themeIcon.textContent = theme === "dark" ? "D" : "L";
  }

  function renderAll() {
    renderSummary();
    renderTransactions();
  }

  window.ExpenseRender = {
    getElements,
    calculateTotals,
    getVisibleTransactions,
    renderSummary,
    renderTransactions,
    renderCategoryOptions,
    renderCategoryFilter,
    renderFormErrors,
    resetForm,
    fillFormForEdit,
    showFormMessage,
    applyTheme,
    renderAll,
  };
})();