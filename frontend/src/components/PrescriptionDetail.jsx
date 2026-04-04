import PrescriptionMedicationForm from "./PrescriptionMedicationForm";
import PrescriptionMedicationList from "./PrescriptionMedicationList";

function PrescriptionDetail({
  prescription,
  onAddMedication,
  onDeleteMedication,
  isDoctor,
}) {
  if (!prescription) {
    return (
      <div style={styles.wrapper}>
        <h3>Reçete Detayı</h3>
        <p>Detayları görmek için bir reçete seç.</p>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <h3>Seçili Reçete Detayı</h3>

      <p><strong>Patient ID:</strong> {prescription.patientId}</p>
      <p><strong>Doctor ID:</strong> {prescription.doctorId}</p>
      <p>
        <strong>Tarih:</strong>{" "}
        {new Date(prescription.datePrescribed).toLocaleDateString("tr-TR")}
      </p>
      <p><strong>Talimat:</strong> {prescription.instructions}</p>

      {isDoctor && (
        <PrescriptionMedicationForm
          onSubmit={onAddMedication}
          disabled={!prescription}
        />
      )}

      {!isDoctor && (
        <p style={styles.note}>
          Hasta hesabı yalnızca reçete detaylarını görüntüleyebilir.
        </p>
      )}

      <h4>Reçetedeki İlaçlar</h4>
      <PrescriptionMedicationList
        medications={prescription.medications || []}
        onDelete={onDeleteMedication}
        isDoctor={isDoctor}
      />
    </div>
  );
}

const styles = {
  wrapper: {
    marginTop: "24px",
    padding: "16px",
    border: "1px solid #ddd",
    background: "white",
  },
  note: {
    color: "#666",
    fontSize: "14px",
  },
};

export default PrescriptionDetail;