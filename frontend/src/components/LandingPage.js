import { useNavigate } from 'react-router-dom';
import { Wallet, Target, BarChart3, ShieldCheck, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Logo from './Logo';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();
  const goRegister = () => navigate('/login', { state: { mode: 'register' } });
  const goLogin = () => navigate('/login');

  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="landing-brand">
          <Logo size={36} />
          <span>TallyD</span>
        </div>
        <div className="landing-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#analytics">Analytics</a>
          <a href="#about">About</a>
        </div>
        <div className="landing-nav-actions">
          <button className="btn-ghost" onClick={goLogin}>Log In</button>
          <button className="btn-primary" onClick={goRegister}>Get Started</button>
        </div>
      </nav>

      <section className="landing-hero">
        <div className="landing-hero-shape-1" />
        <div className="landing-hero-shape-2" />

        <div className="landing-hero-text">
          <h1>
            Every <span className="text-gradient">expense</span>,<br />counted.
          </h1>
          <p>
            TallyD helps you track expenses, manage budgets, and understand
            your spending — all in one beautiful place.
          </p>
          <div className="landing-hero-actions">
            <button className="btn-primary btn-large" onClick={goRegister}>Get Started Free</button>
            <button className="btn-outline btn-large" onClick={goLogin}>Take a Tour</button>
          </div>
        </div>

        <div className="landing-hero-preview">
          <div className="preview-card">
            <div className="preview-card-top">
              <span>Total Balance</span>
              <TrendingUp size={16} color="#25B77A" />
            </div>
            <div className="preview-balance">₹42,500.00</div>
            <div className="preview-change">↑ 8.4% from last month</div>

            <div className="preview-stats">
              <div className="preview-stat soft-green">
                <span className="preview-stat-label">Income</span>
                <span className="preview-stat-value">₹60,000</span>
                <span className="preview-stat-delta up"><ArrowUpRight size={12} /> 5.2%</span>
              </div>
              <div className="preview-stat soft-orange">
                <span className="preview-stat-label">Expenses</span>
                <span className="preview-stat-value">₹17,500</span>
                <span className="preview-stat-delta down"><ArrowDownRight size={12} /> 4.2%</span>
              </div>
              <div className="preview-stat soft-purple">
                <span className="preview-stat-label">Savings</span>
                <span className="preview-stat-value">₹42,500</span>
                <span className="preview-stat-delta up"><ArrowUpRight size={12} /> 8.4%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="landing-features">
        <h2>Everything you need to manage your money</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon soft-purple"><Wallet size={22} color="#6D3FE8" /></div>
            <h3>Track Expenses</h3>
            <p>Add and categorize expenses in seconds. See where your money goes.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon soft-pink"><Target size={22} color="#F05A9D" /></div>
            <h3>Manage Budgets</h3>
            <p>Set budgets for categories and get alerts when you're close to the limit.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon soft-orange"><BarChart3 size={22} color="#FF8A34" /></div>
            <h3>Powerful Analytics</h3>
            <p>Beautiful charts and insights to help you understand your spending habits.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon soft-green"><ShieldCheck size={22} color="#25B77A" /></div>
            <h3>Secure &amp; Private</h3>
            <p>Your data is encrypted and secure. We never share your information.</p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="landing-how">
        <h2>How it works</h2>
        <div className="how-steps">
          <div className="how-step">
            <div className="how-number">01</div>
            <h3>Track</h3>
            <p>Log every expense as it happens — quick, simple, and organized by category.</p>
          </div>
          <div className="how-step">
            <div className="how-number">02</div>
            <h3>Plan</h3>
            <p>Set monthly budgets for each category and stay in control of your spending.</p>
          </div>
          <div className="how-step">
            <div className="how-number">03</div>
            <h3>Understand</h3>
            <p>See trends and patterns with clear, beautiful analytics — no guesswork.</p>
          </div>
        </div>
      </section>

      <section className="landing-cta">
        <h2>Ready to take control of your spending?</h2>
        <button className="btn-primary btn-large" onClick={goRegister}>Get Started Free</button>
      </section>

      <footer className="landing-footer">
        <div className="landing-brand">
          <Logo size={28} />
          <span>TallyD</span>
        </div>
        <p>© 2026 TallyD. Every expense counted.</p>
      </footer>
    </div>
  );
}

export default LandingPage;