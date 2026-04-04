import { useState } from "react";

function PrescriptionMedicationForm({ onSubmit, disabled }) {
  const [formData, setFormData] = useState({
    name: "",
    expirationDate: "",
    unitsPerBox: "",
    boxCount: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      name: formData.name,
      expirationDate: formData.expirationDate,
      unitsPerBox: Number(formData.unitsPerBox),
      boxCount: Number(formData.boxCount),
    });

    setFormData({
      name: "",
      expirationDate: "",
      unitsPerBox: "",
      boxCount: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h4>Reçeteye İlaç Ekle</h4>

      <input
        type="text"
        name="name"
        placeholder="İlaç adı"
        value={formData.name}
        onChange={handleChange}
        required
        disabled={disabled}
      />

      <input
        type="date"
        name="expirationDate"
        value={formData.expirationDate}
        onChange={handleChange}
        required
        disabled={disabled}
      />

      <input
        type="number"
        name="unitsPerBox"
        placeholder="Kutu içi adet"
        value={formData.unitsPerBox}
        onChange={handleChange}
        required
        min="1"
        disabled={disabled}
      />

      <input
        type="number"
        name="boxCount"
        placeholder="Kutu sayısı"
        value={formData.boxCount}
        onChange={handleChange}
        required
        min="1"
        disabled={disabled}
      />

      <button type="submit" disabled={disabled}>
        İlacı Ekle
      </button>

      {disabled && (
        <p style={styles.note}>Önce bir reçete seçmen gerekiyor.</p>
      )}
    </form>
  );
}

const styles = {
  form: {
    display: "grid",
    gap: "12px",
    marginTop: "24px",
    marginBottom: "24px",
    padding: "16px",
    border: "1px solid #ddd",
    background: "white",
  },
  note: {
    margin: 0,
    color: "#666",
    fontSize: "14px",
  },
};

export default PrescriptionMedicationForm;