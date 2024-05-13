export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phoneNumber) => {
  // Regular expression to match phone numbers with exactly 10 digits
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phoneNumber);
};

export const validateAadhar = (aadharNumber) => {
  // Regular expression to match 12-digit Aadhar numbers
  const aadharRegex = /^\d{12}$/;
  return aadharRegex.test(aadharNumber);
};

export const validateGSTNumber = (gstNumber) => {
  // Regular expression to match GST number format
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstRegex.test(gstNumber);
};

export const validatePANNumber = (panNumber) => {
  // Regular expression to match PAN number format
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(panNumber);
};
