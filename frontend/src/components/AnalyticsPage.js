import { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  TrendingUp, TrendingDown, Wallet, Star, FileText,
  Utensils, ShoppingBag, Plane, Receipt, Film, GraduationCap, Sparkles,
} from 'lucide-react';
import { getExpenses } from '../api/expenses';
import { getBudgets } from '../api/budgets';

const CATEGORY_META = {
  'Food & Dining': { icon: Utensils, color: '#FF8A34', bg: '#FFF2E8' },
  'Shopping': { icon: ShoppingBag, color: '#F05A9D', bg: '#FFF0F7' },
  'Travel': { icon: Plane, color: '#25B77A', bg: '#EAF9F3' },
  'Bills & Utilities': { icon: Receipt, color: '#3155F5', bg: '#EEF3FF' },
  'Entertainment': { icon: Film, color: '#F2B705', bg: '#FFF9E5' },
  'Education': { icon: GraduationCap, color: '#6D3FE8', bg: '#F1ECFF' },
};
const DONUT_COLORS = ['#6D3FE8', '#FF8A34', '#F05A9D', '#3155F5', '#25B77A', '#F2B705', '#8B5CF6'];
const getMeta = (name) => CATEGORY_META[name] || { icon: Sparkles, color: '#64748B', bg: '#F1F5F9' };

function pct(current, previous) {
  if (!previous) return null;
  return ((current - previous) / previous) * 100;
}

function Delta({ value, invert }) {
  if (value === null || !isFinite(value)) return null;
  const isUp = value >= 0;
  const good = invert ? !isUp : isUp;
  const Icon = isUp ? TrendingUp : TrendingDown;
  return (
    <span className={`analytics-delta ${good ? 'good' : 'bad'}`}>
      <Icon size={12} /> {Math.abs(value).toFixed(1)}% vs previous period
    </span>
  );
}

function AnalyticsPage() {
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getExpenses(), getBudgets()])
      .then(([expRes, budRes]) => {
        setExpenses(expRes.data);
        setBudgets(budRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="hint-text">Loading analytics...</p>;
  if (expenses.length === 0) {
    return (
      <div className="page-container">
        <div className="page-header">
          <div>
            <h2 className="page-title">Analytics</h2>
            <p className="page-subtitle">Understand your spending patterns and trends.</p>
          </div>
        </div>
        <div className="empty-state">
          <TrendingUp size={32} color="#8B5CF6" />
          <p>Log some expenses to see your analytics.</p>
        </div>
      </div>
    );
  }

  const sorted = [...expenses].sort((a, b) => new Date(a.date) - new Date(b.date));
  const mid = Math.floor(sorted.length / 2) || 1;
  const prevHalf = sorted.slice(0, mid);
  const currHalf = sorted.slice(mid).length ? sorted.slice(mid) : sorted;

  const sum = (arr) => arr.reduce((s, e) => s + parseFloat(e.amount), 0);
  const totalSpent = sum(sorted);
  const currTotal = sum(currHalf);
  const prevTotal = sum(prevHalf);

  const daySpan = (arr) => {
    if (arr.length < 2) return 1;
    const times = arr.map((e) => new Date(e.date).getTime());
    return Math.max(1, (Math.max(...times) - Math.min(...times)) / 86400000);
  };
  const avgDaily = totalSpent / daySpan(sorted);
  const currAvgDaily = currTotal / daySpan(currHalf);
  const prevAvgDaily = prevTotal / daySpan(prevHalf);

  // Category breakdown
  const categoryTotals = {};
  expenses.forEach((e) => {
    const label = e.category_name || 'Uncategorized';
    categoryTotals[label] = (categoryTotals[label] || 0) + parseFloat(e.amount);
  });
  const categoryData = Object.entries(categoryTotals)
    .map(([name, value]) => ({ name, value, percent: Math.round((value / totalSpent) * 100) }))
    .sort((a, b) => b.value - a.value);
  const topCategory = categoryData[0];

  // Spending trend (cumulative by date)
  const dateTotals = {};
  sorted.forEach((e) => { dateTotals[e.date] = (dateTotals[e.date] || 0) + parseFloat(e.amount); });
  const trendData = Object.entries(dateTotals).map(([date, amount]) => ({ date, amount }));

  // Weekly comparison: current month vs previous month, bucketed by week-of-month
  const now = new Date(sorted[sorted.length - 1].date);
  const thisMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthKey = `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, '0')}`;

  const weekOf = (dateStr) => Math.min(4, Math.floor((new Date(dateStr).getDate() - 1) / 7));
  const weeklyThis = [0, 0, 0, 0, 0];
  const weeklyPrev = [0, 0, 0, 0, 0];
  expenses.forEach((e) => {
    const mk = e.date.slice(0, 7);
    if (mk === thisMonthKey) weeklyThis[weekOf(e.date)] += parseFloat(e.amount);
    if (mk === prevMonthKey) weeklyPrev[weekOf(e.date)] += parseFloat(e.amount);
  });
  const monthlyData = [0, 1, 2, 3, 4].map((i) => ({
    week: `Week ${i + 1}`,
    'This Month': weeklyThis[i],
    'Last Month': weeklyPrev[i],
  })).filter((w) => w['This Month'] > 0 || w['Last Month'] > 0);

  // Budget vs Actual
  const budgetRows = budgets.map((budget) => {
    const bMonth = budget.month.slice(0, 7);
    const spent = expenses
      .filter((e) => e.date.slice(0, 7) === bMonth && (budget.category ? e.category === budget.category : true))
      .reduce((s, e) => s + parseFloat(e.amount), 0);
    const amount = parseFloat(budget.amount);
    return {
      id: budget.id,
      name: budget.category_name || 'Overall',
      spent,
      amount,
      pct: amount ? Math.min(100, Math.round((spent / amount) * 100)) : 0,
    };
  }).sort((a, b) => b.pct - a.pct);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Analytics</h2>
          <p className="page-subtitle">Understand your spending patterns and trends.</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="analytics-stat-grid">
        <div className="analytics-stat-card">
          <div className="analytics-stat-icon soft-purple"><TrendingUp size={18} color="#6D3FE8" /></div>
          <div>
            <span className="analytics-stat-label">Total Spending</span>
            <div className="analytics-stat-value">₹{totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
            <Delta value={pct(currTotal, prevTotal)} invert />
          </div>
        </div>
        <div className="analytics-stat-card">
          <div className="analytics-stat-icon soft-blue"><Wallet size={18} color="#3155F5" /></div>
          <div>
            <span className="analytics-stat-label">Average Daily Spend</span>
            <div className="analytics-stat-value">₹{avgDaily.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
            <Delta value={pct(currAvgDaily, prevAvgDaily)} invert />
          </div>
        </div>
        <div className="analytics-stat-card">
          <div className="analytics-stat-icon soft-orange"><Star size={18} color="#FF8A34" /></div>
          <div>
            <span className="analytics-stat-label">Top Category</span>
            <div className="analytics-stat-value">{topCategory?.name || '—'}</div>
            <span className="analytics-substat">{topCategory?.percent || 0}% of total spending</span>
          </div>
        </div>
        <div className="analytics-stat-card">
          <div className="analytics-stat-icon soft-pink"><FileText size={18} color="#F05A9D" /></div>
          <div>
            <span className="analytics-stat-label">Total Expenses Logged</span>
            <div className="analytics-stat-value">{expenses.length}</div>
            <Delta value={pct(currHalf.length, prevHalf.length)} invert />
          </div>
        </div>
      </div>

      {/* Spending Trend + Category Distribution */}
      <div className="analytics-two-col">
        <div className="dash-card">
          <div className="dash-card-header"><h3>Spending Trend</h3></div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={trendData} margin={{ top: 4, right: 12, left: -8, bottom: 4 }}>
  <defs>
    <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#6D3FE8" stopOpacity={0.35} />
      <stop offset="100%" stopColor="#6D3FE8" stopOpacity={0} />
    </linearGradient>
  </defs>
  <XAxis
    dataKey="date"
    type="category"
    tick={{ fontSize: 11 }}
    tickFormatter={(dateStr) => {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    }}
    interval="preserveStartEnd"
    minTickGap={24}
  />
  <YAxis tick={{ fontSize: 11 }} />
  <Tooltip formatter={(value) => [`₹${value}`, 'Spent']} />
  <Area type="monotone" dataKey="amount" stroke="#6D3FE8" strokeWidth={3} fill="url(#trendFill)" />
</AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="dash-card">
          <div className="dash-card-header"><h3>Category Distribution</h3></div>
          <div className="donut-wrap">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={2}>
                  {categoryData.map((entry, i) => (
                    <Cell key={entry.name} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="donut-center">
              <span className="donut-total">₹{(totalSpent / 1000).toFixed(1)}k</span>
              <span className="donut-total-label">Total</span>
            </div>
          </div>
          <div className="donut-legend">
            {categoryData.map((cat, i) => (
              <div className="donut-legend-row" key={cat.name}>
                <span className="donut-dot" style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                <span className="donut-legend-name">{cat.name}</span>
                <span className="donut-legend-pct">{cat.percent}%</span>
                <span className="donut-legend-amount">₹{cat.value.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Comparison + Budget vs Actual */}
      <div className="analytics-two-col">
        <div className="dash-card">
          <div className="dash-card-header"><h3>Monthly Comparison</h3></div>
          {monthlyData.length === 0 ? (
            <p className="hint-text">Not enough data yet for a weekly comparison.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                <Legend />
                <Bar dataKey="This Month" fill="#3155F5" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Last Month" fill="#D6E0FA" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="dash-card">
          <div className="dash-card-header"><h3>Budget vs Actual</h3></div>
          {budgetRows.length === 0 ? (
            <p className="hint-text">Set a budget to compare it against actual spending.</p>
          ) : (
            <div className="budget-vs-actual-list">
              {budgetRows.map((row) => {
                const meta = getMeta(row.name);
                const Icon = meta.icon;
                const over = row.pct >= 90;
                return (
                  <div className="bva-row" key={row.id}>
                    <div className="bva-icon" style={{ background: meta.bg }}>
                      <Icon size={16} color={meta.color} />
                    </div>
                    <div className="bva-mid">
                      <span className="bva-name">{row.name}</span>
                      <div className="bva-track">
                        <div
                          className="bva-fill"
                          style={{ width: `${row.pct}%`, background: over ? '#F05A9D' : '#6D3FE8' }}
                        />
                      </div>
                    </div>
                    <div className="bva-figures">
                      <span className="bva-amounts">₹{row.spent.toLocaleString('en-IN')} / ₹{row.amount.toLocaleString('en-IN')}</span>
                      <span className={`bva-pct ${over ? 'over' : ''}`}>{row.pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;