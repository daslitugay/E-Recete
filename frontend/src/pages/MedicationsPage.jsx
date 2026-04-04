import { useEffect, useState } from "react";
import api from "../api/axios";
import MedicationForm from "../components/MedicationForm";
import MedicationList from "../components/MedicationList";
import  { getCurrentUser } from "../utils/auth";

function MedicationsPage() {
  const [medications, setMedications] = useState([]);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [error, setError] = useState("");
  const user = getCurrentUser();
  const isDoctor = user?.role === "doctor";

  const fetchMedications = async () => {
    try {
      const response = await api.get("/medications");
      setMedications(response.data);
    } catch (err) {
      setError("İlaçlar yüklenemedi.");
    }
  };

  useEffect(() => {
    fetchMedications();
  }, []);

  const handleCreate = async (formData) => {
    try {
      await api.post("/medications", formData);
      fetchMedications();
    } catch (err) {
      setError("İlaç eklenemedi.");
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await api.put(`/medications/${selectedMedication._id}`, formData);
      setSelectedMedication(null);
      fetchMedications();
    } catch (err) {
      setError("İlaç güncellenemedi.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/medications/${id}`);
      fetchMedications();
    } catch (err) {
      setError("İlaç silinemedi.");
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <h1>İlaçlar</h1>

      <p style={{ marginBottom: "16px" }}>
        Giriş yapan kullanıcı: <strong>{user?.name}</strong> ({user?.role})
      </p>

      <MedicationForm
        onSubmit={selectedMedication ? handleUpdate : handleCreate}
        initialData={selectedMedication}
        editing={!!selectedMedication}
      />

      {selectedMedication && (
        <button onClick={() => setSelectedMedication(null)} style={{ marginBottom: "16px" }}>
          Düzenlemeyi İptal Et
        </button>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      <MedicationList
        medications={medications}
        onEdit={setSelectedMedication}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default MedicationsPage;