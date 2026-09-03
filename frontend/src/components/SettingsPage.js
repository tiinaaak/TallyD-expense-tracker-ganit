import { useState } from 'react';
import './SettingsPage.css';
import {
  User,
  Mail,
  Bell,
  Shield,
  Palette,
  HelpCircle,
  ChevronRight,
  Wallet,
  CalendarDays,
  Info,
  Trash2,
  Monitor,
  Sun,
  Moon,
  Check,
  X,
} from 'lucide-react';

function SettingsPage() {
  const username =
    localStorage.getItem('username') || 'User';

  const email =
    localStorage.getItem('email') || '';

  const [modal, setModal] = useState(null);

  const [currency, setCurrency] = useState(
    localStorage.getItem('currency') || 'INR'
  );

  const [dateFormat, setDateFormat] = useState(
    localStorage.getItem('dateFormat') || 'DD/MM/YYYY'
  );

  const [theme, setTheme] = useState(
    localStorage.getItem('appearance') || 'Light'
  );

  const [notifications, setNotifications] = useState(
    JSON.parse(
      localStorage.getItem('notificationPreferences') ||
      '{"expense":true,"budget":true,"insights":true}'
    )
  );

  const currencyData = {
    INR: { symbol: '₹', name: 'Indian Rupee' },
    USD: { symbol: '$', name: 'US Dollar' },
    EUR: { symbol: '€', name: 'Euro' },
    GBP: { symbol: '£', name: 'British Pound' },
  };

  const saveCurrency = (value) => {
    setCurrency(value);
    localStorage.setItem('currency', value);
    setModal(null);
  };

  const saveDateFormat = (value) => {
    setDateFormat(value);
    localStorage.setItem('dateFormat', value);
    setModal(null);
  };

  const saveTheme = (value) => {
    setTheme(value);
    localStorage.setItem('appearance', value);
    setModal(null);
  };

  const updateNotification = (key) => {
    const updated = {
      ...notifications,
      [key]: !notifications[key],
    };

    setNotifications(updated);

    localStorage.setItem(
      'notificationPreferences',
      JSON.stringify(updated)
    );
  };

  const currentCurrency =
    currencyData[currency] || currencyData.INR;

  return (
    <div className="settings-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="settings-header">

        <div>
          <h1>
            Settings <span>⚙</span>
          </h1>

          <p>
            Manage your account, preferences and security.
          </p>
        </div>

        <div className="settings-decoration">
          ⚙
        </div>

      </div>


      {/* =====================================================
          SETTINGS GRID
      ===================================================== */}

      <div className="settings-grid">


        {/* ===================================================
            ACCOUNT
        =================================================== */}

        <div className="settings-card">

          <div className="settings-card-header">

            <div className="settings-icon account-icon">
              <User />
            </div>

            <div>
              <h2>Account</h2>
              <p>
                Manage your personal account information.
              </p>
            </div>

          </div>


          <div className="account-profile">

            <div className="profile-avatar">
              {username.charAt(0).toUpperCase()}
            </div>

            <div>

              <div className="profile-name">
                <strong>{username}</strong>

                <span>
                  Account
                </span>
              </div>

              <div className="profile-row">
                <Mail />
                {email || 'No email added'}
              </div>

            </div>

          </div>


          <div className="settings-list">

            <div
              className="setting-row action-row"
              onClick={() => setModal('profile')}
            >
              <User />

              <span>
                Profile information
              </span>

              <ChevronRight />
            </div>

          </div>

        </div>


        {/* ===================================================
            SECURITY
        =================================================== */}

        <div className="settings-card">

          <div className="settings-card-header">

            <div className="settings-icon security-icon">
              <Shield />
            </div>

            <div>
              <h2>Security</h2>
              <p>
                Keep your TallyD account secure.
              </p>
            </div>

          </div>


          <div className="settings-list">

            <div
              className="setting-row action-row"
              onClick={() => setModal('password')}
            >
              <Shield />

              <span>
                Password & Security
              </span>

              <ChevronRight />
            </div>


            <div className="setting-row">

              <Shield />

              <span>
                Account status
              </span>

              <strong className="active-session">
                Active
              </strong>

            </div>

          </div>

        </div>


        {/* ===================================================
            PREFERENCES
        =================================================== */}

        <div className="settings-card">

          <div className="settings-card-header">

            <div className="settings-icon preference-icon">
              <Palette />
            </div>

            <div>
              <h2>Preferences</h2>
              <p>
                Customize how TallyD works for you.
              </p>
            </div>

          </div>


          <div className="settings-list">

            {/* Appearance */}

            <div
              className="setting-row action-row"
              onClick={() => setModal('appearance')}
            >

              <Palette />

              <span>
                Appearance
              </span>

              <strong>
                {theme}
              </strong>

              <ChevronRight />

            </div>


            {/* Currency */}

            <div
              className="setting-row action-row"
              onClick={() => setModal('currency')}
            >

              <Wallet />

              <span>
                Currency
              </span>

              <strong>
                {currentCurrency.symbol} {currency}
              </strong>

              <ChevronRight />

            </div>


            {/* Date */}

            <div
              className="setting-row action-row"
              onClick={() => setModal('date')}
            >

              <CalendarDays />

              <span>
                Date format
              </span>

              <strong>
                {dateFormat}
              </strong>

              <ChevronRight />

            </div>

          </div>

        </div>


        {/* ===================================================
            NOTIFICATIONS
        =================================================== */}

        <div className="settings-card">

          <div className="settings-card-header">

            <div className="settings-icon notification-icon">
              <Bell />
            </div>

            <div>
              <h2>Notifications</h2>
              <p>
                Manage your expense and budget alerts.
              </p>
            </div>

          </div>


          <div className="settings-list">

            <div className="setting-row">

              <Bell />

              <span>
                Expense alerts
              </span>

              <label className="toggle">

                <input
                  type="checkbox"
                  checked={notifications.expense}
                  onChange={() =>
                    updateNotification('expense')
                  }
                />

                <span className="toggle-slider" />

              </label>

            </div>


            <div className="setting-row">

              <Bell />

              <span>
                Budget alerts
              </span>

              <label className="toggle">

                <input
                  type="checkbox"
                  checked={notifications.budget}
                  onChange={() =>
                    updateNotification('budget')
                  }
                />

                <span className="toggle-slider" />

              </label>

            </div>


            <div className="setting-row">

              <Bell />

              <span>
                Spending insights
              </span>

              <label className="toggle">

                <input
                  type="checkbox"
                  checked={notifications.insights}
                  onChange={() =>
                    updateNotification('insights')
                  }
                />

                <span className="toggle-slider" />

              </label>

            </div>

          </div>

        </div>


        {/* ===================================================
            HELP
        =================================================== */}

        <div className="settings-card">

          <div className="settings-card-header">

            <div className="settings-icon help-icon">
              <HelpCircle />
            </div>

            <div>
              <h2>Help & Support</h2>
              <p>
                Find answers and get help with TallyD.
              </p>
            </div>

          </div>


          <div className="settings-list">

            <div
              className="setting-row action-row"
              onClick={() => setModal('help')}
            >

              <HelpCircle />

              <span>
                Help & Support
              </span>

              <ChevronRight />

            </div>


            <div
              className="setting-row action-row"
              onClick={() => setModal('about')}
            >

              <Info />

              <span>
                About TallyD
              </span>

              <ChevronRight />

            </div>

          </div>

        </div>


        {/* ===================================================
            ABOUT
        =================================================== */}

        <div className="settings-card">

          <div className="settings-card-header">

            <div className="settings-icon legal-icon">
              <Info />
            </div>

            <div>
              <h2>About TallyD</h2>
              <p>
                Your personal expense management platform.
              </p>
            </div>

          </div>


          <div className="settings-list">

            <div
              className="setting-row action-row"
              onClick={() => setModal('about')}
            >

              <Info />

              <span>
                Application information
              </span>

              <ChevronRight />

            </div>


            <div className="setting-row">

              <span>
                Version
              </span>

              <strong>
                1.0.0
              </strong>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          DELETE ACCOUNT
      ===================================================== */}

      <div className="account-actions">

        <div className="delete-icon">
          <Trash2 />
        </div>

        <div className="delete-content">

          <h2>
            Delete Account
          </h2>

          <p>
            Permanently remove your TallyD account and data.
          </p>

        </div>

        <div className="delete-decoration">
          ×
        </div>

        <button
          className="delete-button"
          onClick={() => setModal('delete')}
        >
          <Trash2 size={15} />
          Delete Account
        </button>

      </div>


      {/* =====================================================
          MODALS
      ===================================================== */}

      {modal && (

        <div
          className="settings-modal-overlay"
          onClick={() => setModal(null)}
        >

          <div
            className="settings-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="settings-modal-close"
              onClick={() => setModal(null)}
            >
              <X size={18} />
            </button>


            {/* ================= CURRENCY ================= */}

            {modal === 'currency' && (
              <>
                <div className="settings-modal-header">

                  <div className="settings-modal-icon currency">
                    <Wallet size={20} />
                  </div>

                  <div>
                    <h3>Currency</h3>
                    <p>
                      Choose the currency used throughout TallyD.
                    </p>
                  </div>

                </div>


                <div className="settings-option-list">

                  {Object.entries(currencyData).map(
                    ([code, data]) => (

                      <button
                        key={code}
                        className={`settings-option ${
                          currency === code
                            ? 'selected'
                            : ''
                        }`}
                        onClick={() =>
                          saveCurrency(code)
                        }
                      >

                        <div className="settings-option-symbol">
                          {data.symbol}
                        </div>

                        <div>
                          <strong>
                            {data.name}
                          </strong>

                          <span>
                            {data.symbol} {code}
                          </span>
                        </div>

                        {currency === code && (
                          <Check size={18} />
                        )}

                      </button>

                    )
                  )}

                </div>
              </>
            )}


            {/* ================= DATE ================= */}

            {modal === 'date' && (
              <>
                <div className="settings-modal-header">

                  <div className="settings-modal-icon date">
                    <CalendarDays size={20} />
                  </div>

                  <div>
                    <h3>Date Format</h3>
                    <p>
                      Choose how dates appear in TallyD.
                    </p>
                  </div>

                </div>


                <div className="settings-option-list">

                  {[
                    'DD/MM/YYYY',
                    'MM/DD/YYYY',
                    'YYYY-MM-DD',
                  ].map((format) => (

                    <button
                      key={format}
                      className={`settings-option ${
                        dateFormat === format
                          ? 'selected'
                          : ''
                      }`}
                      onClick={() =>
                        saveDateFormat(format)
                      }
                    >

                      <div className="settings-option-preview">
                        {format}
                      </div>

                      {dateFormat === format && (
                        <Check size={18} />
                      )}

                    </button>

                  ))}

                </div>
              </>
            )}


            {/* ================= APPEARANCE ================= */}

            {modal === 'appearance' && (
              <>
                <div className="settings-modal-header">

                  <div className="settings-modal-icon appearance">
                    <Palette size={20} />
                  </div>

                  <div>
                    <h3>Appearance</h3>
                    <p>
                      Choose how TallyD looks.
                    </p>
                  </div>

                </div>


                <div className="settings-option-list">

                  {[
                    {
                      name: 'Light',
                      icon: <Sun size={18} />,
                      description:
                        'Clean and bright interface',
                    },
                    {
                      name: 'Dark',
                      icon: <Moon size={18} />,
                      description:
                        'Dark interface for low-light use',
                    },
                    {
                      name: 'System',
                      icon: <Monitor size={18} />,
                      description:
                        'Follow your device preference',
                    },
                  ].map((item) => (

                    <button
                      key={item.name}
                      className={`settings-option ${
                        theme === item.name
                          ? 'selected'
                          : ''
                      }`}
                      onClick={() =>
                        saveTheme(item.name)
                      }
                    >

                      <div className="settings-option-symbol">
                        {item.icon}
                      </div>

                      <div>
                        <strong>
                          {item.name}
                        </strong>

                        <span>
                          {item.description}
                        </span>
                      </div>

                      {theme === item.name && (
                        <Check size={18} />
                      )}

                    </button>

                  ))}

                </div>
              </>
            )}


            {/* ================= PROFILE ================= */}

            {modal === 'profile' && (
              <>
                <div className="settings-modal-header">

                  <div className="settings-modal-icon profile">
                    <User size={20} />
                  </div>

                  <div>
                    <h3>Profile Information</h3>
                    <p>
                      Your current TallyD account details.
                    </p>
                  </div>

                </div>


                <div className="settings-profile-modal">

                  <div className="settings-avatar large">
                    {username.charAt(0).toUpperCase()}
                  </div>

                  <strong>
                    {username}
                  </strong>

                  <span>
                    {email || 'No email available'}
                  </span>

                </div>

              </>
            )}


            {/* ================= PASSWORD ================= */}

            {modal === 'password' && (
              <>
                <div className="settings-modal-header">

                  <div className="settings-modal-icon security">
                    <Shield size={20} />
                  </div>

                  <div>
                    <h3>Password & Security</h3>
                    <p>
                      Manage your account security.
                    </p>
                  </div>

                </div>

                <div className="settings-coming-soon">
                  Password management will be connected
                  to the existing password reset API next.
                </div>
              </>
            )}


            {/* ================= HELP ================= */}

            {modal === 'help' && (
              <>
                <div className="settings-modal-header">

                  <div className="settings-modal-icon help">
                    <HelpCircle size={20} />
                  </div>

                  <div>
                    <h3>Help & Support</h3>
                    <p>
                      Need help with TallyD?
                    </p>
                  </div>

                </div>

                <div className="settings-coming-soon">
                  Help and support information can be
                  added here.
                </div>
              </>
            )}


            {/* ================= ABOUT ================= */}

            {modal === 'about' && (
              <>
                <div className="settings-modal-header">

                  <div className="settings-modal-icon about">
                    <Info size={20} />
                  </div>

                  <div>
                    <h3>About TallyD</h3>
                    <p>
                      Your personal expense management platform.
                    </p>
                  </div>

                </div>

                <div className="settings-about">

                  <div className="settings-about-logo">
                    T
                  </div>

                  <strong>
                    TallyD
                  </strong>

                  <span>
                    Every expense counted.
                  </span>

                  <small>
                    Version 1.0.0 · © 2026
                  </small>

                </div>

              </>
            )}


            {/* ================= DELETE ================= */}

            {modal === 'delete' && (
              <>
                <div className="settings-modal-header">

                  <div className="settings-modal-icon help">
                    <Trash2 size={20} />
                  </div>

                  <div>
                    <h3>Delete Account</h3>
                    <p>
                      This action cannot be undone.
                    </p>
                  </div>

                </div>

                <div className="settings-coming-soon">
                  Account deletion will be connected to
                  the backend after the confirmation flow
                  is implemented.
                </div>

              </>
            )}

          </div>

        </div>

      )}

    </div>
  );
}

export default SettingsPage;