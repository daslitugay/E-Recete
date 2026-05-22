const { EVENT_TYPES, publishEvent } = require('../config/rabbitmq');

const publishPrescriptionCreated = async (prescription, actorId) => {
  try {
    const payload = {
      prescriptionId: prescription._id,
      patientId: prescription.patient?._id || prescription.patient,
      doctorId: prescription.doctor?._id || prescription.doctor,
      actorId,
      itemCount: prescription.items?.length || 0,
      status: prescription.status,
      createdAt: prescription.createdAt,
    };

    return await publishEvent(EVENT_TYPES.PRESCRIPTION_CREATED, payload);
  } catch (error) {
    console.error(`Publish prescription created event error: ${error.message}`);
    return false;
  }
};

module.exports = {
  publishPrescriptionCreated,
};