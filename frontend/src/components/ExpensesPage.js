import { useState, useEffect } from 'react';
import { Plus, Trash2, Wallet } from 'lucide-react';
import { toast } from 'react-toastify';
import { getExpenses, createExpense, deleteExpense } from '../api/expenses';
import { getCategories } from '../api/categories';

function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [categoryFilter, setCategoryFilter] = useState('All');
  const [monthFilter, setMonthFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc');

  const fetchExpenses = async () => {
    try {
      const response = await getExpenses();
      setExpenses(response.data);
    } catch (err) {
      setError('Could not load expenses.');
      toast.error('Could not load expenses.');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (err) {
      setError('Could not load categories.');
      toast.error('Could not load categories.');
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!amount || !category || !date) {
      setError('Amount, category, and date are required.');
      return;
    }

    setLoading(true);
    try {
      await createExpense({ amount, category: Number(category), date, description });
      setAmount('');
      setCategory('');
      setDate('');
      setDescription('');
      fetchExpenses();
      toast.success('Expense added!');
    } catch (err) {
      setError('Could not add expense.');
      toast.error('Could not add expense.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      fetchExpenses();
      toast.success('Expense deleted.');
    } catch (err) {
      setError('Could not delete expense.');
      toast.error('Could not delete expense.');
    }
  };

  const uniqueCategoryNames = ['All', ...new Set(expenses.map((e) => e.category_name).filter(Boolean))];

  const formatMonthLabel = (yyyyMm) => {
    const [year, mon] = yyyyMm.split('-').map(Number);
    return new Date(year, mon - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const uniqueMonths = [
    ...new Set(expenses.map((e) => e.date.slice(0, 7))),
  ].sort((a, b) => b.localeCompare(a)); // newest first

  const filteredExpenses = expenses
    .filter((e) => categoryFilter === 'All' || e.category_name === categoryFilter)
    .filter((e) => monthFilter === 'All' || e.date.slice(0, 7) === monthFilter);

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    switch (sortBy) {
      case 'date-asc':
        return new Date(a.date) - new Date(b.date);
      case 'date-desc':
        return new Date(b.date) - new Date(a.date);
      case 'amount-asc':
        return parseFloat(a.amount) - parseFloat(b.amount);
      case 'amount-desc':
        return parseFloat(b.amount) - parseFloat(a.amount);
      default:
        return 0;
    }
  });

  const totalSpent = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Expenses</h2>
          <p className="page-subtitle">
            {expenses.length} expense{expenses.length !== 1 ? 's' : ''} · ₹{totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2 })} total
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="expense-form-card">
        <div className="expense-form-row">
          <div className="form-field">
            <label>Amount</label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="tally-input"
            />
          </div>
          <div className="form-field">
            <label>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="tally-select"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="tally-input"
            />
          </div>
          <div className="form-field form-field-wide">
            <label>Description</label>
            <input
              type="text"
              placeholder="Optional"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="tally-input"
            />
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-primary expense-submit-btn">
          <Plus size={16} /> {loading ? 'Adding...' : 'Add Expense'}
        </button>
      </form>

      {categories.length === 0 && (
        <p className="hint-text">No categories yet — add one from the Categories page first.</p>
      )}
      {error && <p className="error-text">{error}</p>}

      {expenses.length > 0 && (
        <div className="filter-bar">
          <div className="form-field">
            <label>Filter by month</label>
            <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} className="tally-select">
              <option value="All">All</option>
              {uniqueMonths.map((m) => (
                <option key={m} value={m}>{formatMonthLabel(m)}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>Filter by category</label>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="tally-select">
              {uniqueCategoryNames.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>Sort by</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="tally-select">
              <option value="date-desc">Date (newest first)</option>
              <option value="date-asc">Date (oldest first)</option>
              <option value="amount-desc">Amount (highest first)</option>
              <option value="amount-asc">Amount (lowest first)</option>
            </select>
          </div>
          <span className="result-count">
            {sortedExpenses.length} of {expenses.length}
          </span>
        </div>
      )}

      {expenses.length === 0 ? (
        <div className="empty-state">
          <Wallet size={32} color="#8B5CF6" />
          <p>No expenses logged yet. Add your first one above.</p>
        </div>
      ) : sortedExpenses.length === 0 ? (
        <p className="hint-text">No expenses match this filter.</p>
      ) : (
        <>
          {/* Desktop table */}
          <div className="expense-table-wrap">
            <table className="tally-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {sortedExpenses.map((exp) => (
                  <tr key={exp.id}>
                    <td>{exp.date}</td>
                    <td><span className="category-pill">{exp.category_name || '—'}</span></td>
                    <td>{exp.description || '—'}</td>
                    <td className="amount-cell">₹{exp.amount}</td>
                    <td>
                      <button onClick={() => handleDelete(exp.id)} className="icon-delete-btn">
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="expense-card-list">
            {sortedExpenses.map((exp) => (
              <div key={exp.id} className="expense-card">
                <div className="expense-card-top">
                  <span className="category-pill">{exp.category_name || '—'}</span>
                  <span className="amount-cell">₹{exp.amount}</span>
                </div>
                <div className="expense-card-bottom">
                  <div>
                    <div className="expense-card-desc">{exp.description || 'No description'}</div>
                    <div className="expense-card-date">{exp.date}</div>
                  </div>
                  <button onClick={() => handleDelete(exp.id)} className="icon-delete-btn">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ExpensesPage;