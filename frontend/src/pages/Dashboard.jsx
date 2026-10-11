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
  const [sortBy, setSortBy] = useState('newest');
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
      setExpenses((prev) =>
        prev.map((exp) => (exp._id === id ? updated : exp))
      );
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
    const matchesCategory =
      category === 'all' || exp.category === category;

    const matchesSearch = (exp.title || '')
      .toLowerCase()
      .includes(search.trim().toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const total = visibleExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const sortedExpenses = [...visibleExpenses].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }

    if (sortBy === 'oldest') {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }

    if (sortBy === 'high-low') {
      return Number(b.amount) - Number(a.amount);
    }

    if (sortBy === 'low-high') {
      return Number(a.amount) - Number(b.amount);
    }

    return 0;
  });

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

      <div className="sort-toolbar">
        <label htmlFor="sortBy">Sort by: </label>
        <select
          id="sortBy"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="high-low">Amount high-low</option>
          <option value="low-high">Amount low-high</option>
        </select>
      </div>

      <ExpenseList
        expenses={sortedExpenses}
        onEdit={setEditingExpense}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default Dashboard;
