import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LogOut,
  Settings,
  ShieldCheck,
  ArrowLeftCircle,
  Bell,
} from 'lucide-react';
import Logo from './Logo';

import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../api/notifications';

function Header({ onLogout }) {
  const username = localStorage.getItem('username') || 'User';
  const isStaff = localStorage.getItem('is_staff') === 'true';
  const initial = username.charAt(0).toUpperCase();

  const [open, setOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  const menuRef = useRef(null);
  const notificationRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const inAdminPanel = location.pathname.startsWith(
    '/dashboard/admin'
  );

  // ============================================================
  // FETCH NOTIFICATIONS
  // ============================================================

  const loadNotifications = async () => {
    try {
      setNotificationsLoading(true);

      const data = await getNotifications();

      setNotifications(
        Array.isArray(data) ? data : []
      );

    } catch (error) {
      console.error(
        'Failed to load notifications:',
        error
      );
    } finally {
      setNotificationsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();

    // Refresh notifications periodically
    const interval = setInterval(
      loadNotifications,
      30000
    );

    return () => clearInterval(interval);
  }, []);

  // ============================================================
  // CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
  // ============================================================

  useEffect(() => {
    function handleClickOutside(e) {

      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setOpen(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      ) {
        setNotificationsOpen(false);
      }
    }

    document.addEventListener(
      'mousedown',
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
    };
  }, []);

  // ============================================================
  // UNREAD COUNT
  // ============================================================

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  // ============================================================
  // TIME FORMATTER
  // ============================================================

  const getTimeAgo = (dateString) => {
    if (!dateString) {
      return '';
    }

    const created = new Date(dateString);
    const now = new Date();

    const difference =
      Math.floor(
        (now.getTime() - created.getTime()) / 1000
      );

    if (difference < 60) {
      return 'Just now';
    }

    const minutes = Math.floor(
      difference / 60
    );

    if (minutes < 60) {
      return `${minutes} min ago`;
    }

    const hours = Math.floor(
      minutes / 60
    );

    if (hours < 24) {
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    }

    const days = Math.floor(
      hours / 24
    );

    if (days === 1) {
      return 'Yesterday';
    }

    if (days < 7) {
      return `${days} days ago`;
    }

    return created.toLocaleDateString(
      'en-IN',
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }
    );
  };

  // ============================================================
  // NOTIFICATION ICON
  // ============================================================

  const getNotificationIcon = (type) => {

    if (type === 'budget') {
      return '🎯';
    }

    if (type === 'expense') {
      return '💳';
    }

    if (type === 'insight') {
      return '✦';
    }

    return '🔔';
  };

  const getNotificationClass = (type) => {

    if (type === 'budget') {
      return 'budget';
    }

    if (type === 'expense') {
      return 'expense';
    }

    if (type === 'insight') {
      return 'insight';
    }

    return 'default';
  };

  // ============================================================
  // HANDLE NOTIFICATION CLICK
  // ============================================================

  const handleNotificationClick = async (
    notification
  ) => {

    try {
      if (!notification.is_read) {
        await markNotificationRead(
          notification.id
        );

        setNotifications((previous) =>
          previous.map((item) =>
            item.id === notification.id
              ? {
                  ...item,
                  is_read: true,
                }
              : item
          )
        );
      }
    } catch (error) {
      console.error(
        'Failed to mark notification as read:',
        error
      );
    }

    setNotificationsOpen(false);

    // Navigate according to notification type
    if (
      notification.notification_type === 'budget'
    ) {
      navigate('/dashboard/budgets');
    } else if (
      notification.notification_type === 'expense'
    ) {
      navigate('/dashboard/expenses');
    } else if (
      notification.notification_type === 'insight'
    ) {
      navigate('/dashboard/analytics');
    }
  };

  // ============================================================
  // MARK ALL AS READ
  // ============================================================

  const handleMarkAllAsRead = async () => {

    if (unreadCount === 0) {
      return;
    }

    try {
      await markAllNotificationsRead();

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          is_read: true,
        }))
      );

    } catch (error) {
      console.error(
        'Failed to mark all notifications as read:',
        error
      );
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <header className="topbar">

      {/* Brand */}
      <div className="topbar-brand">
        <Logo size={30} />
        <span>TallyD</span>
      </div>


      <div className="topbar-right">

        {/* ====================================================
            NOTIFICATIONS
        ==================================================== */}

        <div
          className="topbar-notif-wrap"
          ref={notificationRef}
        >

          <button
            type="button"
            className="topbar-notif-btn"
            title="Notifications"
            aria-label="Notifications"
            onClick={() =>
              setNotificationsOpen(
                (previous) => !previous
              )
            }
          >

            <Bell size={18} />

            {unreadCount > 0 && (
              <span className="notification-badge">
                {unreadCount > 99
                  ? '99+'
                  : unreadCount}
              </span>
            )}

          </button>


          {notificationsOpen && (
            <div className="topbar-notif-dropdown">

              {/* Notification header */}

              <div className="notification-header">

                <strong>
                  Notifications
                </strong>

                <span>
                  {unreadCount > 0
                    ? `${unreadCount} new`
                    : 'All caught up'}
                </span>

              </div>


              {/* Loading */}

              {notificationsLoading && (
                <div className="notification-empty">
                  Loading notifications...
                </div>
              )}


              {/* Empty */}

              {!notificationsLoading &&
                notifications.length === 0 && (
                  <div className="notification-empty">
                    No notifications yet.
                  </div>
                )}


              {/* Notifications */}

              {!notificationsLoading &&
                notifications.length > 0 && (

                  <div className="notification-list">

                    {notifications
                      .slice(0, 5)
                      .map((notification) => (

                        <button
                          type="button"
                          key={notification.id}
                          className={`notification-item ${
                            notification.is_read
                              ? 'notification-read'
                              : 'notification-unread'
                          }`}
                          onClick={() =>
                            handleNotificationClick(
                              notification
                            )
                          }
                        >

                          <div
                            className={`notification-item-icon ${getNotificationClass(
                              notification.notification_type
                            )}`}
                          >
                            {getNotificationIcon(
                              notification.notification_type
                            )}
                          </div>


                          <div className="notification-item-content">

                            <strong>
                              {notification.title}
                            </strong>

                            <p>
                              {notification.message}
                            </p>

                            <small>
                              {getTimeAgo(
                                notification.created_at
                              )}
                            </small>

                          </div>

                        </button>

                      ))}

                  </div>
                )}


              {/* Mark all as read */}

              {unreadCount > 0 && (
                <button
                  type="button"
                  className="notification-view-all"
                  onClick={handleMarkAllAsRead}
                >
                  Mark all as read
                </button>
              )}

            </div>
          )}

        </div>


        {/* ====================================================
            ADMIN PANEL
        ==================================================== */}

        {isStaff && (
          inAdminPanel ? (
            <button
              className="admin-toggle-btn"
              onClick={() =>
                navigate('/dashboard')
              }
            >
              <ArrowLeftCircle size={16} />
              Back to Dashboard
            </button>
          ) : (
            <button
              className="admin-toggle-btn"
              onClick={() =>
                navigate(
                  '/dashboard/admin/users'
                )
              }
            >
              <ShieldCheck size={16} />
              Admin Panel
            </button>
          )
        )}


        {/* ====================================================
            PROFILE
        ==================================================== */}

        <div
          className="topbar-profile-wrap"
          ref={menuRef}
        >

          <button
            className="topbar-profile"
            onClick={() =>
              setOpen(
                (previous) => !previous
              )
            }
            aria-label="Account menu"
          >
            {initial}
          </button>


          {open && (
            <div className="topbar-dropdown">

              <div className="topbar-dropdown-username">
                {username}
              </div>


              {/* Settings */}

              <button
                className="topbar-dropdown-item"
                onClick={() => {
                  setOpen(false);
                  navigate(
                    '/dashboard/settings'
                  );
                }}
              >
                <Settings size={16} />
                Settings
              </button>


              {/* Logout */}

              <button
                className="topbar-dropdown-item topbar-dropdown-logout"
                onClick={() => {
                  setOpen(false);
                  onLogout();
                }}
              >
                <LogOut size={16} />
                Log Out
              </button>

            </div>
          )}

        </div>

      </div>

    </header>
  );
}

export default Header;