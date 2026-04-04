import { useEffect, useState } from "react";

function MedicationForm({ onSubmit, initialData, editing }) {
  const [formData, setFormData] = useState({
    name: "",
    expirationDate: "",
    unitsPerBox: "",
    boxCount: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        expirationDate: initialData.expirationDate
          ? initialData.expirationDate.slice(0, 10)
          : "",
        unitsPerBox: initialData.unitsPerBox || "",
        boxCount: initialData.boxCount || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      ...formData,
      unitsPerBox: Number(formData.unitsPerBox),
      boxCount: Number(formData.boxCount),
    });

    if (!editing) {
      setFormData({
        name: "",
        expirationDate: "",
        unitsPerBox: "",
        boxCount: "",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        type="text"
        name="name"
        placeholder="İlaç adı"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <input
        type="date"
        name="expirationDate"
        value={formData.expirationDate}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="unitsPerBox"
        placeholder="Kutu içi adet"
        value={formData.unitsPerBox}
        onChange={handleChange}
        required
        min="1"
      />

      <input
        type="number"
        name="boxCount"
        placeholder="Kutu sayısı"
        value={formData.boxCount}
        onChange={handleChange}
        required
        min="1"
      />

      <button type="submit">
        {editing ? "Güncelle" : "İlaç Ekle"}
      </button>
    </form>
  );
}

const styles = {
  form: {
    display: "grid",
    gap: "12px",
    marginBottom: "24px",
  },
};

export default MedicationForm;