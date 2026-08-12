import { useState, useEffect } from 'react';
import { getExpenses, createExpense, deleteExpense } from '../api/expenses';

const CATEGORY_OPTIONS = [
  'Food & Dining',
  'Shopping',
  'Travel',
  'Bills & Utilities',
  'Entertainment',
  'Health',
  'Education',
  'Subscriptions',
  'Rent',
  'Other',
];

function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc');

  const fetchExpenses = async () => {
    try {
      const response = await getExpenses();
      setExpenses(response.data);
    } catch (err) {
      setError('Could not load expenses.');
    }
  };

  useEffect(() => {
    fetchExpenses();
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
      await createExpense({ amount, category, date, description });
      setAmount('');
      setCategory('');
      setDate('');
      setDescription('');
      fetchExpenses();
    } catch (err) {
      setError('Could not add expense.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      fetchExpenses();
    } catch (err) {
      setError('Could not delete expense.');
    }
  };

  const uniqueCategories = ['All', ...new Set(expenses.map((e) => e.category))];

  const filteredExpenses =
    categoryFilter === 'All'
      ? expenses
      : expenses.filter((e) => e.category === categoryFilter);

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

  return (
    <div>
      <h2 style={{ color: '#1A1A2E' }}>Expenses</h2>

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '24px',
          padding: '20px',
          backgroundColor: '#F7F7FB',
          borderRadius: '12px',
        }}
      >
        <input
          type="number"
          step="0.01"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={inputStyle}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ ...selectStyle, minWidth: '160px' }}
        >
          <option value="">Select category</option>
          {CATEGORY_OPTIONS.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ ...inputStyle, flex: 1, minWidth: '200px' }}
        />
        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? 'Adding...' : 'Add Expense'}
        </button>
      </form>

      {error && <p style={{ color: '#E74C3C' }}>{error}</p>}

      {expenses.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '16px',
            alignItems: 'center',
          }}
        >
          <div>
            <label style={filterLabelStyle}>Filter by category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={selectStyle}
            >
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={filterLabelStyle}>Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={selectStyle}
            >
              <option value="date-desc">Date (newest first)</option>
              <option value="date-asc">Date (oldest first)</option>
              <option value="amount-desc">Amount (highest first)</option>
              <option value="amount-asc">Amount (lowest first)</option>
            </select>
          </div>

          <span style={{ color: '#8B8FA3', fontSize: '13px', marginTop: '18px' }}>
            {sortedExpenses.length} of {expenses.length} expense{expenses.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {expenses.length === 0 ? (
        <p style={{ color: '#8B8FA3' }}>No expenses logged yet.</p>
      ) : sortedExpenses.length === 0 ? (
        <p style={{ color: '#8B8FA3' }}>No expenses match this filter.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #E4E4EF' }}>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Category</th>
              <th style={thStyle}>Description</th>
              <th style={thStyle}>Amount</th>
              <th style={thStyle}></th>
            </tr>
          </thead>
          <tbody>
            {sortedExpenses.map((exp) => (
              <tr key={exp.id} style={{ borderBottom: '1px solid #EEEEF5' }}>
                <td style={tdStyle}>{exp.date}</td>
                <td style={tdStyle}>{exp.category}</td>
                <td style={tdStyle}>{exp.description || '—'}</td>
                <td style={tdStyle}>₹{exp.amount}</td>
                <td style={tdStyle}>
                  <button onClick={() => handleDelete(exp.id)} style={deleteButtonStyle}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const inputStyle = {
  padding: '10px 12px',
  border: '1px solid #DCDCE8',
  borderRadius: '8px',
  fontSize: '14px',
};

const selectStyle = {
  padding: '9px 12px',
  border: '1px solid #DCDCE8',
  borderRadius: '8px',
  fontSize: '13px',
  backgroundColor: '#fff',
  display: 'block',
};

const filterLabelStyle = {
  display: 'block',
  fontSize: '12px',
  color: '#8B8FA3',
  marginBottom: '4px',
  fontWeight: '600',
};

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#FF6B35',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontWeight: '600',
  cursor: 'pointer',
};

const deleteButtonStyle = {
  padding: '6px 12px',
  backgroundColor: 'transparent',
  color: '#E74C3C',
  border: '1px solid #E74C3C',
  borderRadius: '6px',
  fontSize: '13px',
  cursor: 'pointer',
};

const thStyle = { padding: '10px', color: '#1A1A2E', fontSize: '13px' };
const tdStyle = { padding: '10px', fontSize: '14px', color: '#333' };

export default ExpensesPage;