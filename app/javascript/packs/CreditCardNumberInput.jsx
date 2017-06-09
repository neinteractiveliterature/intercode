import React, { PropTypes } from 'react';
import Payment from 'payment';

const CARD_TYPE_ICONS = {
  'visa': 'fa-cc-visa',
  'mastercard': 'fa-cc-mastercard',
  'amex': 'fa-cc-amex',
  'dinersclub': 'fa-cc-dinersclub',
  'discover': 'fa-cc-discover',
  'jcb': 'fa-cc-jcb',
  'unknown': 'fa-credit-card'
};

class CreditCardNumberInput extends React.Component {
  getIconClass = () => {
    let iconClass;
    let backgroundClass;
    let colorClass;
    const cardNumber = this.props.value;

    if (cardNumber && cardNumber.length > 0) {
      var cardType = Payment.fns.cardType(cardNumber);

      if (cardType) {
        iconClass = CARD_TYPE_ICONS[cardType] || CARD_TYPE_ICONS['unknown'];

        var cardTypeObject = Payment.getCardArray().find((card) => { return card.type === cardType });
        if (cardTypeObject.length.includes(cardNumber.replace(/\s/g, '').length)) {
          if (Payment.fns.validateCardNumber(cardNumber)) {
            backgroundClass = 'bg-success';
            colorClass = 'text-success';
          } else {
            iconClass = 'fa-exclamation-triangle';
            backgroundClass = 'bg-danger';
            colorClass = 'text-danger';
          }
        }
      } else {
        iconClass = CARD_TYPE_ICONS['unknown'];
      }
    } else {
      iconClass = CARD_TYPE_ICONS['unknown'];
    }

    return `fa ${iconClass} ${colorClass}`;
  }

  render() {
    return (
      <div className="form-group">
        <label htmlFor={this.props.id} className="control-label">Credit card number</label>
        <div className="input-group">
          <input
            type="tel"
            className="form-control"
            placeholder="•••• •••• •••• ••••"
            {...this.props}
          />
          <span className="input-group-addon">
            <i className={this.getIconClass()}></i>
          </span>
        </div>
      </div>
    );
  }
}

export default CreditCardNumberInput;