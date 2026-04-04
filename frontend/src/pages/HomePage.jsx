import { Link } from "react-router-dom";
import { getCurrentUser, isAuthenticated } from "../utils/auth";

function HomePage() {
  const loggedIn = isAuthenticated();
  const user = getCurrentUser();

  return (
    <div style={styles.wrapper}>
      <h1>E-Reçete Sistemi</h1>
      <p>
        Evde bulunan ilaçları ve reçeteleri düzenli şekilde takip etmek için
        geliştirilmiş bir sistem.
      </p>

      {loggedIn ? (
        <div style={styles.card}>
          <h3>Hoş geldin, {user?.name}</h3>
          <p>Rolün: <strong>{user?.role}</strong></p>

          <div style={styles.links}>
            <Link to="/medications" style={styles.linkButton}>
              İlaçlara Git
            </Link>

            <Link to="/prescriptions" style={styles.linkButton}>
              Reçetelere Git
            </Link>
          </div>
        </div>
      ) : (
        <div style={styles.links}>
          <Link to="/login" style={styles.linkButton}>
            Giriş Yap
          </Link>
          <Link to="/register" style={styles.linkButton}>
            Kayıt Ol
          </Link>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    padding: "24px",
  },
  card: {
    marginTop: "24px",
    padding: "16px",
    background: "white",
    border: "1px solid #ddd",
  },
  links: {
    display: "flex",
    gap: "12px",
    marginTop: "16px",
    flexWrap: "wrap",
  },
  linkButton: {
    textDecoration: "none",
    padding: "10px 14px",
    border: "1px solid #ccc",
    background: "white",
    color: "#222",
  },
};

export default HomePage;