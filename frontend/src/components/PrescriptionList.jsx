function PrescriptionList({ prescriptions, onEdit, onDelete, onSelect, isDoctor }) {
  if (prescriptions.length === 0) {
    return <p>Henüz reçete oluşturulmamış.</p>;
  }

  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th>Patient ID</th>
          <th>Doctor ID</th>
          <th>Tarih</th>
          <th>Talimat</th>
          <th>İlaç Sayısı</th>
          <th>İşlem</th>
        </tr>
      </thead>
      <tbody>
        {prescriptions.map((prescription) => (
          <tr key={prescription._id}>
            <td>{prescription.patientId}</td>
            <td>{prescription.doctorId}</td>
            <td>
              {new Date(prescription.datePrescribed).toLocaleDateString("tr-TR")}
            </td>
            <td>{prescription.instructions}</td>
            <td>{prescription.medications?.length || 0}</td>
            <td>
              <button onClick={() => onSelect(prescription)} style={styles.button}>
                Gör
              </button>

              {isDoctor && (
                <>
                  <button onClick={() => onEdit(prescription)} style={styles.button}>
                    Düzenle
                  </button>
                  <button onClick={() => onDelete(prescription._id)} style={styles.button}>
                    Sil
                  </button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const styles = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  button: {
    marginRight: "8px",
    cursor: "pointer",
  },
};

export default PrescriptionList;