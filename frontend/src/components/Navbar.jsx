function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <h2>Expense Tracker</h2>

      {user && (
        <div className="nav-right">
          <span>
            {user.name} <span className="role-tag">{user.role}</span>
          </span>
          <button onClick={onLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
