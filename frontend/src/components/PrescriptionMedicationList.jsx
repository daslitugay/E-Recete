function PrescriptionMedicationList({ medications, onDelete, isDoctor }) {
  if (!medications || medications.length === 0) {
    return <p>Bu reçeteye henüz ilaç eklenmemiş.</p>;
  }

  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th>İlaç Adı</th>
          <th>Son Kullanma</th>
          <th>Kutu İçi Adet</th>
          <th>Kutu Sayısı</th>
          <th>Toplam Adet</th>
          {isDoctor && <th>İşlem</th>}
        </tr>
      </thead>
      <tbody>
        {medications.map((medication) => (
          <tr key={medication._id}>
            <td>{medication.name}</td>
            <td>
              {new Date(medication.expirationDate).toLocaleDateString("tr-TR")}
            </td>
            <td>{medication.unitsPerBox}</td>
            <td>{medication.boxCount}</td>
            <td>{medication.unitsPerBox * medication.boxCount}</td>
            {isDoctor && (
              <td>
                <button onClick={() => onDelete(medication._id)} style={styles.button}>
                  Sil
                </button>
              </td>
            )}
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
    marginTop: "12px",
  },
  button: {
    cursor: "pointer",
  },
};

export default PrescriptionMedicationList;