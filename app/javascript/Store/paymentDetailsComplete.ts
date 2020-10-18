import { PaymentDetails } from './OrderPaymentForm';

export default function paymentDetailsComplete(paymentDetails: PaymentDetails) {
  const missingFields = (['name'] as const).filter(
    (field) => !paymentDetails[field] || paymentDetails[field].toString().trim() === '',
  );

  return missingFields.length === 0;
}
