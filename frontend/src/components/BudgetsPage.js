import { useState, useEffect } from 'react';
import { Plus, Trash2, Target, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-toastify';
import { getBudgets, createBudget, deleteBudget } from '../api/budgets';
import { getCategories } from '../api/categories';
import { getExpenses } from '../api/expenses';

function BudgetsPage() {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [month, setMonth] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  const fetchAll = async () => {
    try {
      const [budgetsRes, categoriesRes, expensesRes] = await Promise.all([
        getBudgets(),
        getCategories(),
        getExpenses(),
      ]);
      setBudgets(budgetsRes.data);
      setCategories(categoriesRes.data);
      setExpenses(expensesRes.data);
    } catch (err) {
      setError('Could not load budgets.');
      toast.error('Could not load budgets.');
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // Default the Add form's month to whichever month is currently selected
  useEffect(() => {
    setMonth(selectedMonth);
  }, [selectedMonth]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!amount || !month) {
      setError('Amount and month are required.');
      return;
    }

    setLoading(true);
    try {
      await createBudget({
        amount,
        category: category ? Number(category) : null,
        month: `${month}-01`,
      });
      setAmount('');
      setCategory('');
      setMonth(selectedMonth);
      fetchAll();
      toast.success('Budget added!');
    } catch (err) {
      const msg = err.response?.data?.non_field_errors?.[0] || 'Could not create budget.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBudget(id);
      fetchAll();
      toast.success('Budget deleted.');
    } catch (err) {
      setError('Could not delete budget.');
      toast.error('Could not delete budget.');
    }
  };

  // Calculate spent amount for a given budget (matching month + category)
  const getSpentForBudget = (budget) => {
    const budgetMonth = budget.month.slice(0, 7); // "2026-08"
    return expenses
      .filter((exp) => {
        const expMonth = exp.date.slice(0, 7);
        if (expMonth !== budgetMonth) return false;
        if (budget.category) {
          return exp.category === budget.category;
        }
        return true; // overall budget counts all expenses that month
      })
      .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
  };

  const formatMonth = (monthStr) => {
    const date = new Date(monthStr);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const formatMonthLabel = (yyyyMm) => {
    const [year, mon] = yyyyMm.split('-').map(Number);
    return new Date(year, mon - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const shiftMonth = (direction) => {
    const [year, mon] = selectedMonth.split('-').map(Number);
    const shifted = new Date(year, mon - 1 + direction, 1);
    const newYear = shifted.getFullYear();
    const newMonth = String(shifted.getMonth() + 1).padStart(2, '0');
    setSelectedMonth(`${newYear}-${newMonth}`);
  };

  const budgetsForSelectedMonth = budgets.filter(
    (b) => b.month.slice(0, 7) === selectedMonth
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Budgets</h2>
          <p className="page-subtitle">Set monthly spending limits, overall or by category.</p>
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
            <label>Category (optional)</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="tally-select"
            >
              <option value="">Overall (all categories)</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>Month</label>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="tally-input"
            />
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-primary expense-submit-btn">
          <Plus size={16} /> {loading ? 'Adding...' : 'Add Budget'}
        </button>
      </form>

      {error && <p className="error-text">{error}</p>}

      {/* Month selector */}
      <div className="month-selector">
        <button
          type="button"
          onClick={() => shiftMonth(-1)}
          className="month-selector-btn"
          aria-label="Previous month"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="month-selector-label">{formatMonthLabel(selectedMonth)}</span>
        <button
          type="button"
          onClick={() => shiftMonth(1)}
          className="month-selector-btn"
          aria-label="Next month"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {budgetsForSelectedMonth.length === 0 ? (
        <div className="empty-state">
          <Target size={32} color="#8B5CF6" />
          <p>No budgets set for {formatMonthLabel(selectedMonth)}.</p>
        </div>
      ) : (
        <div className="budget-list">
          {budgetsForSelectedMonth.map((budget) => {
            const spent = getSpentForBudget(budget);
            const budgetAmount = parseFloat(budget.amount);
            const pct = budgetAmount ? Math.min(100, Math.round((spent / budgetAmount) * 100)) : 0;
            const isOver = spent > budgetAmount;

            return (
              <div key={budget.id} className="budget-card-item">
                <div className="budget-card-top">
                  <div>
                    <span className="category-pill">
                      {budget.category_name || 'Overall'}
                    </span>
                    <span className="budget-month">{formatMonth(budget.month)}</span>
                  </div>
                  <button onClick={() => handleDelete(budget.id)} className="icon-delete-btn">
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="budget-progress-track">
                  <div
                    className="budget-progress-fill"
                    style={{
                      width: `${pct}%`,
                      background: isOver ? '#F05A9D' : 'var(--tally-gradient-purple-blue)',
                    }}
                  />
                </div>

                <div className="budget-card-bottom">
                  <span className={isOver ? 'budget-amount-over' : 'budget-amount-ok'}>
                    ₹{spent.toLocaleString('en-IN', { minimumFractionDigits: 2 })} spent
                  </span>
                  <span className="budget-amount-total">
                    of ₹{budgetAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default BudgetsPage;