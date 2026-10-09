import { useState, useEffect } from 'react';

const categories = ['food', 'travel', 'shopping', 'bills', 'other'];

function ExpenseForm({ onAdd, onUpdate, editingExpense, cancelEdit }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  // Fill the form when an expense is picked for editing
  useEffect(() => {
    if (editingExpense) {
      setTitle(editingExpense.title);
      setAmount(editingExpense.amount);
      setCategory(editingExpense.category);
      setDate(editingExpense.date.slice(0, 10));
      setDescription(editingExpense.description || '');
    }
  }, [editingExpense]);

  const resetForm = () => {
    setTitle('');
    setAmount('');
    setCategory('food');
    setDate('');
    setDescription('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const expenseData = {
      title,
      amount: Number(amount),
      category,
      date,
      description,
    };

    if (editingExpense) {
      onUpdate(editingExpense._id, expenseData);
    } else {
      onAdd(expenseData);
    }

    resetForm();
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        min="0"
        step="0.01"
        required
      />

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c[0].toUpperCase() + c.slice(1)}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="form-actions">
        <button type="submit">{editingExpense ? 'Update Expense' : 'Add Expense'}</button>

        {editingExpense && (
          <button
            type="button"
            className="secondary-btn"
            onClick={() => {
              cancelEdit();
              resetForm();
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default ExpenseForm;
