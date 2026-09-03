const API_BASE_URL = 'http://tallyd-backend-alb-2084154047.us-east-1.elb.amazonaws.com/api/accounts';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');

  return {
    'Content-Type': 'application/json',
    Authorization: `Token ${token}`,
  };
};


// ============================================================
// GET ALL USERS
// ============================================================

export const getUsers = async () => {
  const response = await fetch(
    `${API_BASE_URL}/users/`,
    {
      method: 'GET',
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Unable to load users. Server returned ${response.status}.`
    );
  }

  return await response.json();
};


// ============================================================
// CHANGE USER ROLE
// ============================================================

export const changeUserRole = async (userId, role) => {
  const response = await fetch(
    `${API_BASE_URL}/users/${userId}/role/`,
    {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        role: role,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || 'Unable to change user role.'
    );
  }

  return data;
};


// ============================================================
// ENABLE / DISABLE USER
// ============================================================

export const changeUserStatus = async (
  userId,
  isActive
) => {
  const response = await fetch(
    `${API_BASE_URL}/users/${userId}/status/`,
    {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        is_active: isActive,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || 'Unable to update user status.'
    );
  }

  return data;
};


// ============================================================
// DELETE USER
// ============================================================

export const deleteUser = async (userId) => {
  const response = await fetch(
    `${API_BASE_URL}/users/${userId}/`,
    {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }
  );

  // DELETE may return an empty response in some cases
  const data = await response.text();

  if (!response.ok) {
    let errorMessage = 'Unable to delete user.';

    try {
      const errorData = JSON.parse(data);
      errorMessage =
        errorData.error || errorMessage;
    } catch {
      // Keep default error message
    }

    throw new Error(errorMessage);
  }

  if (!data) {
    return {
      message: 'User deleted successfully.',
    };
  }

  try {
    return JSON.parse(data);
  } catch {
    return {
      message: data,
    };
  }
};
