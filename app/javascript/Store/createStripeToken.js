/* global Stripe */

export default function createStripeToken(paymentDetails) {
  return new Promise((resolve, reject) => {
    const handleResponse = (status, response) => {
      if (response.error) {
        reject(response.error);
      } else {
        resolve(response.id);
      }
    };

    Stripe.card.createToken({
      number: paymentDetails.ccNumber,
      cvc: paymentDetails.cvc,
      exp_month: paymentDetails.expMonth,
      exp_year: paymentDetails.expYear,
      name: paymentDetails.name,
      address_zip: paymentDetails.zip,
    }, handleResponse);
  });
}
