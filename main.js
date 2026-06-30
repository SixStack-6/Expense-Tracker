(function () {
  const { addTransaction, clearTransactions, deleteTransaction, updateTransaction } = window.ExpenseCrud;
  const { getEditingId, getFilters, getStoredTheme, getTransactions, setFilters, setStoredTheme } = window.ExpenseState;
  const {
    applyTheme,
    fillFormForEdit,
    getElements,
    renderAll,
    renderCategoryFilter,
    renderCategoryOptions,
    renderFormErrors,
    resetForm,
    showFormMessage,
  } = window.ExpenseRender;
  const { todayISO, validateTransaction } = window.ExpenseUtils;

  const elements = getElements();

  function getSelectedType() {
    return document.querySelector('input[name="type"]:checked').value;
  }

  function getFormInput() {
    return {
      label: elements.labelInput.value,
      amount: elements.amountInput.value,
      type: getSelectedType(),
      category: elements.categoryInput.value,
      date: elements.dateInput.value || todayISO(),
    };
  }

  function handleFormSubmit(event) {
    event.preventDefault();

    const formInput = getFormInput();
    const errors = validateTransaction(formInput);
    renderFormErrors(errors);

    if (Object.keys(errors).length) return;

    const editingId = getEditingId();
    const saved = editingId ? updateTransaction(editingId, formInput) : addTransaction(formInput);

    if (!saved) return;

    resetForm();
    renderAll();
    showFormMessage(editingId ? "Transaction updated." : "Transaction added.");
  }

  function handleTransactionAction(event) {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const id = button.dataset.id;
    const transaction = getTransactions().find((item) => item.id === id);
    if (!transaction) return;

    if (button.dataset.action === "edit") {
      fillFormForEdit(transaction);
      return;
    }

    const confirmed = confirm(`Delete "${transaction.label}"?`);
    if (confirmed && deleteTransaction(id)) {
      renderAll();
      showFormMessage("Transaction deleted.");
    }
  }

  function handleTypeChange() {
    renderCategoryOptions(getSelectedType());
  }

  function handleFilterChange() {
    setFilters({
      search: document.querySelector("#searchInput").value.trim(),
      type: document.querySelector("#typeFilter").value,
      category: document.querySelector("#categoryFilter").value,
    });
    renderAll();
  }

  function handleThemeToggle() {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    setStoredTheme(nextTheme);
  }

  function handleClearAll() {
    if (!getTransactions().length) return;

    const confirmed = confirm("Delete all transactions?");
    if (confirmed && clearTransactions()) {
      resetForm();
      renderAll();
      showFormMessage("All transactions cleared.");
    }
  }

  function initializeApp() {
    applyTheme(getStoredTheme());
    renderCategoryOptions(getSelectedType());
    renderCategoryFilter();
    elements.dateInput.value = todayISO();
    renderAll();

    elements.transactionForm.addEventListener("submit", handleFormSubmit);
    document.querySelectorAll('input[name="type"]').forEach((radio) => radio.addEventListener("change", handleTypeChange));
    elements.transactionList.addEventListener("click", handleTransactionAction);
    elements.cancelEditBtn.addEventListener("click", resetForm);
    document.querySelector("#searchInput").addEventListener("input", handleFilterChange);
    document.querySelector("#typeFilter").addEventListener("change", handleFilterChange);
    document.querySelector("#categoryFilter").addEventListener("change", handleFilterChange);
    document.querySelector("#themeToggle").addEventListener("click", handleThemeToggle);
    document.querySelector("#clearAllBtn").addEventListener("click", handleClearAll);

    setFilters(getFilters());
  }

  initializeApp();
})();