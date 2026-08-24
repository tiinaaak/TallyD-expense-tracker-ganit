import {
  User,
  Bell,
  Shield,
  Palette,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';

function SettingsPage() {
  const username =
    localStorage.getItem('username') || 'User';

  const email =
    localStorage.getItem('email') || '';

  return (
    <div className="page-container settings-page">

      {/* Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Settings</h2>

          <p className="page-subtitle">
            Manage your account, preferences and security.
          </p>
        </div>
      </div>


      {/* Profile */}
      <section className="settings-section">

        <div className="settings-section-heading">
          <div className="settings-section-icon profile">
            <User size={18} />
          </div>

          <div>
            <h3>Account</h3>
            <p>
              Manage your personal account information.
            </p>
          </div>
        </div>


        <div className="settings-card">

          <div className="settings-profile">

            <div className="settings-avatar">
              {username
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <strong>{username}</strong>

              {email && (
                <span>{email}</span>
              )}
            </div>

          </div>

        </div>

      </section>


      {/* Preferences */}
      <section className="settings-section">

        <div className="settings-section-heading">
          <div className="settings-section-icon preferences">
            <Palette size={18} />
          </div>

          <div>
            <h3>Preferences</h3>
            <p>
              Customize how TallyD works for you.
            </p>
          </div>
        </div>


        <div className="settings-card">

          <button className="settings-row">

            <div className="settings-row-left">

              <div className="settings-row-icon">
                <Bell size={17} />
              </div>

              <div>
                <strong>Notifications</strong>
                <span>
                  Manage expense and budget alerts.
                </span>
              </div>

            </div>

            <ChevronRight size={17} />

          </button>


          <button className="settings-row">

            <div className="settings-row-left">

              <div className="settings-row-icon">
                <Palette size={17} />
              </div>

              <div>
                <strong>Appearance</strong>
                <span>
                  Customize the look of your dashboard.
                </span>
              </div>

            </div>

            <ChevronRight size={17} />

          </button>

        </div>

      </section>


      {/* Security */}
      <section className="settings-section">

        <div className="settings-section-heading">
          <div className="settings-section-icon security">
            <Shield size={18} />
          </div>

          <div>
            <h3>Security</h3>
            <p>
              Keep your TallyD account secure.
            </p>
          </div>
        </div>


        <div className="settings-card">

          <button className="settings-row">

            <div className="settings-row-left">

              <div className="settings-row-icon">
                <Shield size={17} />
              </div>

              <div>
                <strong>Password & Security</strong>
                <span>
                  Manage your password and account security.
                </span>
              </div>

            </div>

            <ChevronRight size={17} />

          </button>

        </div>

      </section>


      {/* Help */}
      <section className="settings-section">

        <div className="settings-section-heading">
          <div className="settings-section-icon help">
            <HelpCircle size={18} />
          </div>

          <div>
            <h3>Support</h3>
            <p>
              Need help? Find answers and contact support.
            </p>
          </div>
        </div>


        <div className="settings-card">

          <button className="settings-row">

            <div className="settings-row-left">

              <div className="settings-row-icon">
                <HelpCircle size={17} />
              </div>

              <div>
                <strong>Help & Support</strong>
                <span>
                  Get help with your TallyD account.
                </span>
              </div>

            </div>

            <ChevronRight size={17} />

          </button>

        </div>

      </section>

    </div>
  );
}

export default SettingsPage;