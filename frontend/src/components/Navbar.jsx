import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, isAuthenticated, removeToken } from "../utils/auth";

function Navbar() {
  const navigate = useNavigate();
  const loggedIn = isAuthenticated();
  const user = getCurrentUser();

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <Link to="/" style={styles.link}>E-Reçete</Link>
      </div>

      <div style={styles.right}>
        {loggedIn ? (
          <>
            <span style={styles.userInfo}>
              {user?.name} {user?.role ? `(${user.role})` : ""}
            </span>

            <Link to="/medications" style={styles.link}>İlaçlar</Link>
            <Link to="/prescriptions" style={styles.link}>Reçeteler</Link>

            <button onClick={handleLogout} style={styles.button}>
              Çıkış Yap
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Giriş Yap</Link>
            <Link to="/register" style={styles.link}>Kayıt Ol</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
    borderBottom: "1px solid #ddd",
    marginBottom: "24px",
    background: "white",
  },
  left: {
    display: "flex",
    gap: "12px",
  },
  right: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  userInfo: {
    fontSize: "14px",
    color: "#555",
    marginRight: "8px",
  },
  link: {
    textDecoration: "none",
    color: "#222",
    fontWeight: "600",
  },
  button: {
    padding: "8px 12px",
    cursor: "pointer",
  },
};

export default Navbar;