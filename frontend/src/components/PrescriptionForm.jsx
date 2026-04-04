import { useEffect, useState } from "react";

function PrescriptionForm({ onSubmit, initialData, editing, currentDoctorId }) {
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: currentDoctorId || "",
    datePrescribed: "",
    instructions: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        patientId: initialData.patientId || "",
        doctorId: initialData.doctorId || currentDoctorId || "",
        datePrescribed: initialData.datePrescribed
          ? initialData.datePrescribed.slice(0, 10)
          : "",
        instructions: initialData.instructions || "",
      });
    } else {
      setFormData({
        patientId: "",
        doctorId: currentDoctorId || "",
        datePrescribed: "",
        instructions: "",
      });
    }
  }, [initialData, currentDoctorId]);

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
      doctorId: currentDoctorId || formData.doctorId,
      medications: initialData?.medications || [],
    });

    if (!editing) {
      setFormData({
        patientId: "",
        doctorId: currentDoctorId || "",
        datePrescribed: "",
        instructions: "",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        type="text"
        name="patientId"
        placeholder="Patient ID"
        value={formData.patientId}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="doctorId"
        placeholder="Doctor ID"
        value={formData.doctorId}
        readOnly
      />

      <input
        type="date"
        name="datePrescribed"
        value={formData.datePrescribed}
        onChange={handleChange}
        required
      />

      <textarea
        name="instructions"
        placeholder="Kullanım talimatı"
        value={formData.instructions}
        onChange={handleChange}
        rows="4"
        required
      />

      <button type="submit">
        {editing ? "Reçeteyi Güncelle" : "Reçete Oluştur"}
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

export default PrescriptionForm;