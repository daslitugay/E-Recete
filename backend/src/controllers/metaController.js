const asyncHandler = require('express-async-handler');

const { MEDICINE_FORMS } = require('../models/Medicine');
const { getCache, setCache } = require('../utils/cache');

const MEDICINE_FORMS_CACHE_KEY = 'meta:medicine-forms';

const getMedicineForms = asyncHandler(async (req, res) => {
  const cachedForms = await getCache(MEDICINE_FORMS_CACHE_KEY);

  if (cachedForms) {
    res.status(200).json({
      success: true,
      source: 'cache',
      forms: cachedForms,
    });

    return;
  }

  const forms = Object.values(MEDICINE_FORMS).map((value) => ({
    value,
    label: value
      .toLowerCase()
      .split('_')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' '),
  }));

  await setCache(MEDICINE_FORMS_CACHE_KEY, forms, 60 * 60);

  res.status(200).json({
    success: true,
    source: 'database',
    forms,
  });
});

module.exports = {
  getMedicineForms,
};