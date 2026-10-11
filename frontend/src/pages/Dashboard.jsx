import { useState, useEffect } from 'react';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import Filters from '../components/Filters';
import { apiRequest } from '../services/api';

function Dashboard({ user }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    loadExpenses();
  }, []);

  async function loadExpenses() {
    try {
      const data = await apiRequest('/expenses');
      setExpenses(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  const handleAdd = async (expenseData) => {
    try {
      const newExpense = await apiRequest('/expenses', 'POST', expenseData);
      setExpenses((prev) => [newExpense, ...prev]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async (id, expenseData) => {
    try {
      const updated = await apiRequest(`/expenses/${id}`, 'PUT', expenseData);
      setExpenses((prev) => prev.map((exp) => (exp._id === id ? updated : exp)));
      setEditingExpense(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiRequest(`/expenses/${id}`, 'DELETE');
      setExpenses((prev) => prev.filter((exp) => exp._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const visibleExpenses = expenses.filter((exp) => {
    const matchCategory = category === 'all' || exp.category === category;
    const matchSearch = (exp.title || '')
      .toLowerCase()
      .includes(search.trim().toLowerCase());

    return matchCategory && matchSearch;
  });

  const total = visibleExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  if (loading) {
    return <h2 className="status-text">Loading...</h2>;
  }

  return (
    <div className="dashboard">
      <h1>{user.role === 'admin' ? 'All Expenses' : 'My Expenses'}</h1>

      {error && <p className="error-text">{error}</p>}

      <ExpenseForm
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        editingExpense={editingExpense}
        cancelEdit={() => setEditingExpense(null)}
      />

      <div className="dashboard-toolbar">
        <Filters category={category} setCategory={setCategory} />

        <input
          type="text"
          className="search-input"
          placeholder="Search by expense title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <h3>Total: ${total.toFixed(2)}</h3>
      </div>

      <ExpenseList
        expenses={visibleExpenses}
        onEdit={setEditingExpense}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default Dashboard;
