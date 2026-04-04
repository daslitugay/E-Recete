import { useEffect, useState } from "react";
import api from "../api/axios";
import PrescriptionForm from "../components/PrescriptionForm";
import PrescriptionList from "../components/PrescriptionList";
import PrescriptionDetail from "../components/PrescriptionDetail";
import { getCurrentUser } from "../utils/auth";

function PrescriptionsPage() {
  const user = getCurrentUser();
  const isDoctor = user?.role === "doctor";
  const isPatient = user?.role === "patient";

  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [editingPrescription, setEditingPrescription] = useState(null);
  const [error, setError] = useState("");

  const filterPrescriptionsByRole = (allPrescriptions) => {
    if (!user) return [];

    if (isDoctor) {
      return allPrescriptions.filter(
        (prescription) => prescription.doctorId === user.IDnumber
      );
    }

    if (isPatient) {
      return allPrescriptions.filter(
        (prescription) => prescription.patientId === user.IDnumber
      );
    }

    return [];
  };

  const fetchPrescriptions = async () => {
    try {
      const response = await api.get("/prescriptions");
      const filteredPrescriptions = filterPrescriptionsByRole(response.data);

      setPrescriptions(filteredPrescriptions);

      if (selectedPrescription) {
        const updatedSelected = filteredPrescriptions.find(
          (p) => p._id === selectedPrescription._id
        );
        setSelectedPrescription(updatedSelected || null);
      }
    } catch (err) {
      setError("Reçeteler yüklenemedi.");
    }
  };

  const fetchPrescriptionById = async (prescriptionId) => {
    try {
      const response = await api.get(`/prescriptions/${prescriptionId}`);
      const prescription = response.data;

      const isAllowed =
        (isDoctor && prescription.doctorId === user?.IDnumber) ||
        (isPatient && prescription.patientId === user?.IDnumber);

      if (!isAllowed) {
        setSelectedPrescription(null);
        setError("Bu reçeteyi görüntüleme yetkin yok.");
        return;
      }

      setSelectedPrescription(prescription);
      setError("");
    } catch (err) {
      setError("Reçete detayı getirilemedi.");
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const handleCreate = async (formData) => {
    try {
      const payload = {
        ...formData,
        medications: [],
      };

      if (isDoctor) {
        payload.doctorId = user.IDnumber;
      }

      await api.post("/prescriptions", payload);
      setError("");
      fetchPrescriptions();
    } catch (err) {
      setError("Reçete oluşturulamadı.");
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await api.put(`/prescriptions/${editingPrescription._id}`, formData);
      setEditingPrescription(null);
      setError("");
      fetchPrescriptions();
    } catch (err) {
      setError("Reçete güncellenemedi.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/prescriptions/${id}`);

      if (selectedPrescription?._id === id) {
        setSelectedPrescription(null);
      }

      if (editingPrescription?._id === id) {
        setEditingPrescription(null);
      }

      setError("");
      fetchPrescriptions();
    } catch (err) {
      setError("Reçete silinemedi.");
    }
  };

  const handleSelectPrescription = async (prescription) => {
    await fetchPrescriptionById(prescription._id);
  };

  const handleAddMedicationToPrescription = async (medicationData) => {
    if (!selectedPrescription) return;

    try {
      await api.post(
        `/prescriptions/${selectedPrescription._id}/medications`,
        medicationData
      );

      setError("");
      await fetchPrescriptionById(selectedPrescription._id);
      await fetchPrescriptions();
    } catch (err) {
      setError("Reçeteye ilaç eklenemedi.");
    }
  };

  const handleDeleteMedicationFromPrescription = async (medicationId) => {
    if (!selectedPrescription) return;

    try {
      await api.delete(
        `/prescriptions/${selectedPrescription._id}/medications/${medicationId}`
      );

      setError("");
      await fetchPrescriptionById(selectedPrescription._id);
      await fetchPrescriptions();
    } catch (err) {
      setError("Reçetedeki ilaç silinemedi.");
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <h1>Reçeteler</h1>

      <p style={{ marginBottom: "16px" }}>
        Giriş yapan kullanıcı: <strong>{user?.name}</strong> ({user?.role}) — ID:
        <strong> {user?.IDnumber}</strong>
      </p>

      {isDoctor && (
        <>
          <PrescriptionForm
            onSubmit={editingPrescription ? handleUpdate : handleCreate}
            initialData={editingPrescription}
            editing={!!editingPrescription}
            currentDoctorId={user?.IDnumber}
          />

          {editingPrescription && (
            <button
              onClick={() => setEditingPrescription(null)}
              style={{ marginBottom: "16px" }}
            >
              Düzenlemeyi İptal Et
            </button>
          )}
        </>
      )}

      {!isDoctor && (
        <p style={styles.infoBox}>
          Hasta hesabı ile yalnızca kendi reçetelerini görüntüleyebilirsin.
        </p>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      <PrescriptionList
        prescriptions={prescriptions}
        onEdit={isDoctor ? setEditingPrescription : null}
        onDelete={isDoctor ? handleDelete : null}
        onSelect={handleSelectPrescription}
        isDoctor={isDoctor}
      />

      <PrescriptionDetail
        prescription={selectedPrescription}
        onAddMedication={isDoctor ? handleAddMedicationToPrescription : null}
        onDeleteMedication={isDoctor ? handleDeleteMedicationFromPrescription : null}
        isDoctor={isDoctor}
      />
    </div>
  );
}

const styles = {
  infoBox: {
    padding: "12px",
    border: "1px solid #ddd",
    background: "#fff",
    marginBottom: "16px",
  },
};

export default PrescriptionsPage;