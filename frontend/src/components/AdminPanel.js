import { useEffect, useState } from 'react';
import {
  Users,
  ShieldCheck,
  UserCog,
  UserCheck,
  MoreVertical,
  Trash2,
  Shield,
  BriefcaseBusiness,
  UserRound,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'react-toastify';

import {
  getUsers,
  changeUserRole,
  changeUserStatus,
  deleteUser,
} from '../api/users';

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [actionUser, setActionUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [deleteUserTarget, setDeleteUserTarget] = useState(null);

  // ============================================================
  // FETCH USERS
  // ============================================================

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await getUsers();

      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load users:', err);

      setUsers([]);

      setError(
        err.message || 'Could not load users.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ============================================================
  // KPI VALUES
  // ============================================================

  const totalUsers = users.length;

  const adminCount = users.filter(
    (user) => user.role === 'admin'
  ).length;

  const managerCount = users.filter(
    (user) => user.role === 'manager'
  ).length;

  const activeUsers = users.filter(
    (user) => user.status === 'active'
  ).length;

  // ============================================================
  // ROLE HELPERS
  // ============================================================

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin':
        return 'Admin';

      case 'manager':
        return 'Manager';

      default:
        return 'User';
    }
  };

  const getRoleClass = (role) => {
    switch (role) {
      case 'admin':
        return 'admin-role admin-role-admin';

      case 'manager':
        return 'admin-role admin-role-manager';

      default:
        return 'admin-role admin-role-user';
    }
  };

  // ============================================================
  // ROLE ICON
  // ============================================================

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <Shield size={15} />;

      case 'manager':
        return <BriefcaseBusiness size={15} />;

      default:
        return <UserRound size={15} />;
    }
  };

  // ============================================================
  // STATUS
  // ============================================================

  const getStatusClass = (status) => {
    if (status === 'active') {
      return 'admin-status admin-status-active';
    }

    return 'admin-status admin-status-disabled';
  };

  // ============================================================
  // FORMAT CURRENCY
  // ============================================================

  const formatCurrency = (value) => {
    const amount = Number(value || 0);

    return `₹${amount.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // ============================================================
  // CHANGE ROLE
  // ============================================================

  const handleRoleChange = async (user, newRole) => {
    if (!newRole || user.role === newRole) {
      setActionUser(null);
      return;
    }

    try {
      setActionLoading(true);

      await changeUserRole(
        user.id,
        newRole
      );

      toast.success(
        `${user.username}'s role changed to ${getRoleLabel(newRole)}.`
      );

      setActionUser(null);

      await fetchUsers();
    } catch (err) {
      console.error(
        'Role change failed:',
        err
      );

      toast.error(
        err.message ||
          'Unable to change user role.'
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ============================================================
  // ENABLE / DISABLE USER
  // ============================================================

  const handleStatusChange = async (user) => {
    const shouldEnable =
      user.status !== 'active';

    try {
      setActionLoading(true);

      await changeUserStatus(
        user.id,
        shouldEnable
      );

      toast.success(
        shouldEnable
          ? `${user.username} has been enabled.`
          : `${user.username} has been disabled.`
      );

      setActionUser(null);

      await fetchUsers();
    } catch (err) {
      console.error(
        'Status change failed:',
        err
      );

      toast.error(
        err.message ||
          'Unable to update user status.'
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ============================================================
  // OPEN DELETE WARNING
  // ============================================================

  const handleDeleteUser = (user) => {
    setActionUser(null);
    setDeleteUserTarget(user);
  };

  // ============================================================
  // CONFIRM DELETE
  // ============================================================

  const confirmDeleteUser = async () => {
    if (!deleteUserTarget) {
      return;
    }

    try {
      setActionLoading(true);

      await deleteUser(
        deleteUserTarget.id
      );

      toast.success(
        `${deleteUserTarget.username} deleted successfully.`
      );

      setDeleteUserTarget(null);

      await fetchUsers();
    } catch (err) {
      console.error(
        'Delete user failed:',
        err
      );

      toast.error(
        err.message ||
          'Unable to delete user.'
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ============================================================
  // LOADING STATE
  // ============================================================

  if (loading) {
    return (
      <div className="page-container admin-page">

        <div className="page-header">
          <div>
            <h2 className="page-title">
              Admin Panel
            </h2>

            <p className="page-subtitle">
              Manage users and monitor TallyD activity.
            </p>
          </div>
        </div>

        <div className="admin-empty-state">
          Loading users...
        </div>

      </div>
    );
  }

  // ============================================================
  // MAIN PAGE
  // ============================================================

  return (
    <div className="page-container admin-page">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="page-header">

        <div>
          <h2 className="page-title">
            Admin Panel
          </h2>

          <p className="page-subtitle">
            Manage users and monitor TallyD activity.
          </p>
        </div>

      </div>


      {/* ======================================================
          KPI CARDS
      ====================================================== */}

      <div className="admin-summary-grid">

        {/* TOTAL USERS */}

        <div className="admin-summary-card">

          <div className="admin-summary-icon users">
            <Users size={19} />
          </div>

          <div>
            <span>Total Users</span>

            <strong>
              {totalUsers}
            </strong>
          </div>

        </div>


        {/* ADMINS */}

        <div className="admin-summary-card">

          <div className="admin-summary-icon admins">
            <ShieldCheck size={19} />
          </div>

          <div>
            <span>Admins</span>

            <strong>
              {adminCount}
            </strong>
          </div>

        </div>


        {/* MANAGERS */}

        <div className="admin-summary-card">

          <div className="admin-summary-icon managers">
            <UserCog size={19} />
          </div>

          <div>
            <span>Managers</span>

            <strong>
              {managerCount}
            </strong>
          </div>

        </div>


        {/* ACTIVE USERS */}

        <div className="admin-summary-card">

          <div className="admin-summary-icon active-users">
            <UserCheck size={19} />
          </div>

          <div>
            <span>Active Users</span>

            <strong>
              {activeUsers}
            </strong>
          </div>

        </div>

      </div>


      {/* ======================================================
          USERS SECTION
      ====================================================== */}

      <div className="admin-section">

        {/* SECTION HEADER */}

        <div className="admin-section-header">

          <div>
            <h3>
              Users
            </h3>

            <p>
              Manage users, roles and access.
            </p>
          </div>

          <span className="admin-user-count">
            {totalUsers} users
          </span>

        </div>


        {/* ERROR */}

        {error && (
          <div className="admin-error">
            {error}
          </div>
        )}


        {/* EMPTY */}

        {!error && users.length === 0 && (
          <div className="admin-empty-state">
            No users found.
          </div>
        )}


        {/* ====================================================
            TABLE
        ==================================================== */}

        {!error && users.length > 0 && (

          <div className="admin-table-wrap">

            <table className="tally-table admin-table">

              <thead>

                <tr>

                  <th>
                    User
                  </th>

                  <th>
                    Email
                  </th>

                  <th>
                    Role
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Total Expenses
                  </th>

                  <th>
                    Budget
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {users.map((user) => (

                  <tr key={user.id}>

                    {/* USER */}

                    <td>

                      <div className="admin-user-info">

                        <div className="admin-avatar">
                          {user.username
                            ?.charAt(0)
                            .toUpperCase()}
                        </div>

                        <strong>
                          {user.username}
                        </strong>

                      </div>

                    </td>


                    {/* EMAIL */}

                    <td>
                      {user.email || '—'}
                    </td>


                    {/* ROLE */}

                    <td>

                      <span
                        className={getRoleClass(
                          user.role
                        )}
                      >

                        {getRoleIcon(
                          user.role
                        )}

                        {getRoleLabel(
                          user.role
                        )}

                      </span>

                    </td>


                    {/* STATUS */}

                    <td>

                      <span
                        className={getStatusClass(
                          user.status
                        )}
                      >

                        <span className="admin-status-dot">
                          ●
                        </span>

                        {user.status === 'active'
                          ? 'Active'
                          : 'Disabled'}

                      </span>

                    </td>


                    {/* TOTAL EXPENSES */}

                    <td className="admin-number-cell">
                      {formatCurrency(
                        user.total_expenses
                      )}
                    </td>


                    {/* BUDGET */}

                    <td className="admin-number-cell">
                      {formatCurrency(
                        user.budget
                      )}
                    </td>


                    {/* ACTIONS */}

                    <td className="admin-actions-cell">

                      <button
                        type="button"
                        className="admin-action-btn"
                        onClick={() =>
                          setActionUser(
                            actionUser?.id === user.id
                              ? null
                              : user
                          )
                        }
                        disabled={actionLoading}
                        title="User actions"
                        aria-label={`Actions for ${user.username}`}
                      >

                        <MoreVertical size={18} />

                      </button>


                      {/* ==================================================
                          ACTION DROPDOWN
                      ================================================== */}

                      {actionUser?.id === user.id && (

                        <div className="admin-action-menu">

                          <div className="admin-action-menu-title">
                            Change Role
                          </div>


                          {/* USER */}

                          <button
                            type="button"
                            onClick={() =>
                              handleRoleChange(
                                user,
                                'user'
                              )
                            }
                            disabled={
                              actionLoading ||
                              user.role === 'user'
                            }
                          >

                            <UserRound size={15} />

                            User

                          </button>


                          {/* MANAGER */}

                          <button
                            type="button"
                            onClick={() =>
                              handleRoleChange(
                                user,
                                'manager'
                              )
                            }
                            disabled={
                              actionLoading ||
                              user.role === 'manager'
                            }
                          >

                            <BriefcaseBusiness size={15} />

                            Manager

                          </button>


                          {/* ADMIN */}

                          <button
                            type="button"
                            onClick={() =>
                              handleRoleChange(
                                user,
                                'admin'
                              )
                            }
                            disabled={
                              actionLoading ||
                              user.role === 'admin'
                            }
                          >

                            <Shield size={15} />

                            Admin

                          </button>


                          <div className="admin-action-divider" />


                          {/* ENABLE / DISABLE */}

                          <button
                            type="button"
                            onClick={() =>
                              handleStatusChange(
                                user
                              )
                            }
                            disabled={actionLoading}
                          >

                            <UserCheck size={15} />

                            {user.status === 'active'
                              ? 'Disable User'
                              : 'Enable User'}

                          </button>


                          {/* DELETE */}

                          <button
                            type="button"
                            className="admin-action-delete"
                            onClick={() =>
                              handleDeleteUser(
                                user
                              )
                            }
                            disabled={actionLoading}
                          >

                            <Trash2 size={15} />

                            Delete User

                          </button>

                        </div>

                      )}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* ======================================================
          DELETE CONFIRMATION MODAL
      ====================================================== */}

      {deleteUserTarget && (

        <div
          className="admin-delete-overlay"
          onClick={() => {
            if (!actionLoading) {
              setDeleteUserTarget(null);
            }
          }}
        >

          <div
            className="admin-delete-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* WARNING ICON */}

            <div className="admin-delete-icon">
              <AlertTriangle size={24} />
            </div>


            {/* TITLE */}

            <h3>
              Delete User?
            </h3>


            {/* MESSAGE */}

            <p>

              Are you sure you want to delete{' '}

              <strong>
                {deleteUserTarget.username}
              </strong>

              ?

            </p>


            {/* WARNING */}

            <span className="admin-delete-warning">
              This action cannot be undone.
            </span>


            {/* BUTTONS */}

            <div className="admin-delete-actions">

              <button
                type="button"
                className="admin-delete-cancel"
                onClick={() =>
                  setDeleteUserTarget(null)
                }
                disabled={actionLoading}
              >
                Cancel
              </button>


              <button
                type="button"
                className="admin-delete-confirm"
                onClick={confirmDeleteUser}
                disabled={actionLoading}
              >

                {actionLoading
                  ? 'Deleting...'
                  : 'Delete User'}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminPanel;