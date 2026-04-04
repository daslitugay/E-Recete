function MedicationList({ medications, onEdit, onDelete }) {
  if (medications.length === 0) {
    return <p>Henüz ilaç eklenmemiş.</p>;
  }

  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th>İsim</th>
          <th>Son Kullanma</th>
          <th>Kutu İçi Adet</th>
          <th>Kutu Sayısı</th>
          <th>Toplam Adet</th>
          <th>İşlem</th>
        </tr>
      </thead>
      <tbody>
        {medications.map((medication) => (
          <tr key={medication._id}>
            <td>{medication.name}</td>
            <td>{new Date(medication.expirationDate).toLocaleDateString("tr-TR")}</td>
            <td>{medication.unitsPerBox}</td>
            <td>{medication.boxCount}</td>
            <td>{medication.unitsPerBox * medication.boxCount}</td>
            <td>
              <button onClick={() => onEdit(medication)} style={styles.button}>
                Düzenle
              </button>
              <button onClick={() => onDelete(medication._id)} style={styles.button}>
                Sil
              </button>
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

export default MedicationList;