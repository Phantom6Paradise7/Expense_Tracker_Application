import { useState, useEffect } from 'react';

const categories = ['food', 'travel', 'shopping', 'bills', 'other'];

function ExpenseForm({ onAdd, onUpdate, editingExpense, cancelEdit }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});

  // Fill the form when an expense is picked for editing
  
  useEffect(() => {
    if (editingExpense) {
      setTitle(editingExpense.title);
      setAmount(editingExpense.amount);
      setCategory(editingExpense.category);
      setDate(editingExpense.date.slice(0, 10));
      setDescription(editingExpense.description || '');
      setErrors({})
    }
  }, [editingExpense]);

  const resetForm = () => {
    setTitle('');
    setAmount('');
    setCategory('food');
    setDate('');
    setDescription('');
    setErrors({});
  };
  
  const clearError = (field) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };
  
  const validate = () => {
    const newErrors = {};

    if (!title.trim()){
      newErrors.title = 'Title is required.';
    }

    const amountText = String(amount).trim();
    if(!amountText) {
      newErrors.amount = 'Amount is required.';
    } else if (!(Number(amountText) > 0)) {
      newErrors.amount = 'Amount must be greater than 0.'
    } else if (amountText.includes('.') && amountText.split('.')[1].length > 2){
      newErrors.amount = 'Amount can have at most 2 decimal places.';
    }

    if (!date){
      newErrors.date = 'Date is required.';
    } else {
      const now = new Date();
      const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
      if (date > today){
        newErrors.date = 'Date cannot be in the future.';
      }
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0){
      setErrors(validationErrors);
      return;
    }

    setErrors({});

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
    <form className="expense-form" onSubmit={handleSubmit} noValidate>
      <div className="field">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          clearError('title')
        }}
        required
      />
      {errors.title && <p className="field-error">{errors.title}</p>}
      </div>

      <div className="field">
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => {
          setAmount(e.target.value)
          clearError('amount');
        }}
        min="0"
        step="0.01"
        required
      />
      {errors.amount && <p className="field-error">{errors.amount}</p>}
      </div>
        
      <div className="field">
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c[0].toUpperCase() + c.slice(1)}
          </option>
        ))}
      </select>
      </div>

      <div className="field">
      <input
        type="date"
        value={date}
        onChange={(e) => {
          setDate(e.target.value);
          clearError("date");
        }}
        required
      />
      {errors.date && <p className="field-error">{errors.date}</p>}
      </div>

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
