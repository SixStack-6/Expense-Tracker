(function () {
  const { getTransactions, setEditingId, setTransactions } = window.ExpenseState;
  const { createId, normalizeTransactionInput } = window.ExpenseUtils;

  function addTransaction(input) {
    const transactions = getTransactions();
    const normalizedInput = normalizeTransactionInput(input);
    const transaction = {
      id: createId(transactions.map((item) => item.id)),
      ...normalizedInput,
      createdAt: Date.now(),
    };

    return setTransactions([transaction, ...transactions]);
  }

  function updateTransaction(id, input) {
    const normalizedInput = normalizeTransactionInput(input);
    const nextTransactions = getTransactions().map((transaction) =>
      transaction.id === id ? { ...transaction, ...normalizedInput } : transaction
    );

    const saved = setTransactions(nextTransactions);
    if (saved) setEditingId(null);
    return saved;
  }

  function deleteTransaction(id) {
    return setTransactions(getTransactions().filter((transaction) => transaction.id !== id));
  }

  function clearTransactions() {
    return setTransactions([]);
  }

  window.ExpenseCrud = {
    addTransaction,
    updateTransaction,
    deleteTransaction,
    clearTransactions,
  };
})();