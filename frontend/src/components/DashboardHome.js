function DashboardHome() {
  const username = localStorage.getItem('username');

  return (
    <div>
      <h2 style={{ color: '#1A1A2E' }}>Welcome, {username}</h2>
      <p style={{ color: '#8B8FA3' }}>
        Use the sidebar to log expenses, manage budgets, and view analytics.
      </p>
    </div>
  );
}

export default DashboardHome;