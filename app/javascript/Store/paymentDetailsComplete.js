export default function paymentDetailsComplete(paymentDetails) {
  const missingFields = [
    'ccNumber',
    'cvc',
    'expMonth',
    'expYear',
    'zip',
    'name',
  ].filter(field => !paymentDetails[field] || paymentDetails[field].trim() === '');

  return (missingFields.length === 0);
}
