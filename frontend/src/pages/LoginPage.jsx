import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { saveToken } from "../utils/auth";

function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    IDnumber: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/login", formData);
      saveToken(response.data.token);
      navigate("/medications");
    } catch (err) {
      setError(err.response?.data?.message || "Giriş başarısız.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <h2>Giriş Yap</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="IDnumber"
          placeholder="Kimlik Numarası"
          value={formData.IDnumber}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Şifre"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>
      </form>

      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}

const styles = {
  wrapper: {
    maxWidth: "400px",
    margin: "40px auto",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  error: {
    color: "red",
    marginTop: "12px",
  },
};

export default LoginPage;