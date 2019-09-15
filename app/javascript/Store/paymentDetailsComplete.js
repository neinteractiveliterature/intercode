export default function paymentDetailsComplete(paymentDetails) {
  const missingFields = [
    'name',
  ].filter((field) => !paymentDetails[field] || paymentDetails[field].toString().trim() === '');

  return (missingFields.length === 0);
}
