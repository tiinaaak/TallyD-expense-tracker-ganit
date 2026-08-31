const API_URL = 'http://127.0.0.1:8000/api/accounts/notifications/';

const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');

    return {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
    };
};


// ============================================================
// GET NOTIFICATIONS
// ============================================================

export const getNotifications = async () => {
    const response = await fetch(
        API_URL,
        {
            method: 'GET',
            headers: getAuthHeaders(),
        }
    );

    if (!response.ok) {
        throw new Error('Unable to load notifications.');
    }

    return response.json();
};


// ============================================================
// MARK ONE NOTIFICATION AS READ
// ============================================================

export const markNotificationRead = async (notificationId) => {
    const response = await fetch(
        `${API_URL}${notificationId}/read/`,
        {
            method: 'PATCH',
            headers: getAuthHeaders(),
        }
    );

    if (!response.ok) {
        throw new Error(
            'Unable to mark notification as read.'
        );
    }

    return response.json();
};


// ============================================================
// MARK ALL NOTIFICATIONS AS READ
// ============================================================

export const markAllNotificationsRead = async () => {
    const response = await fetch(
        `${API_URL}read-all/`,
        {
            method: 'PATCH',
            headers: getAuthHeaders(),
        }
    );

    if (!response.ok) {
        throw new Error(
            'Unable to mark all notifications as read.'
        );
    }

    return response.json();
};