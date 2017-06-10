import React from 'react';
import PropTypes from 'prop-types';
import { enableUniqueIds } from 'react-html-id';
import CreditCardNumberInput from './CreditCardNumberInput';

class PaymentEntry extends React.Component {
  static propTypes = {
    ccNumber: PropTypes.string.isRequired,
    cvc: PropTypes.string.isRequired,
    expMonth: PropTypes.string.isRequired,
    expYear: PropTypes.string.isRequired,
    zip: PropTypes.string.isRequired,
    onCcNumberChanged: PropTypes.func.isRequired,
    onExpMonthChanged: PropTypes.func.isRequired,
    onExpYearChanged: PropTypes.func.isRequired,
    onCvcChanged: PropTypes.func.isRequired,
    onZipChanged: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    disabled: false,
  };

  constructor(props) {
    super(props);
    enableUniqueIds(this);
  }

  renderLabeledInput = (name, label, type, value, onChange, placeholder) => {
    const inputId = this.nextUniqueId();

    return (
      <div>
        <label htmlFor={inputId} className="control-label">{label}</label>
        <input
          type={type}
          name={name}
          disabled={this.props.disabled}
          id={inputId}
          value={value}
          onChange={onChange}
          className="form-control"
          placeholder={placeholder}
        />
      </div>
    );
  }

  render = () => {
    const ccNumberId = this.nextUniqueId();
    const expMonthId = this.nextUniqueId();

    return (
      <div>
        <CreditCardNumberInput
          id={ccNumberId}
          name="ccNumber"
          value={this.props.ccNumber}
          onChange={this.props.onCcNumberChanged}
          disabled={this.props.disabled}
        />

        <div className="row">
          <div className="col-md-4">
            <div className="form-group">
              <label className="control-label" htmlFor={expMonthId}>Expiration date</label>
              <div className="row">
                <div className="col">
                  <input type="tel" id={expMonthId} name="expMonth" disabled={this.props.disabled} value={this.props.expMonth} onChange={this.props.onExpMonthChanged} className="form-control" size="2" placeholder="MM" />
                </div>
                <div className="col">
                  <input type="tel" name="expYear" disabled={this.props.disabled} value={this.props.expYear} onChange={this.props.onExpYearChanged} className="form-control" size="4" placeholder="YYYY" />
                </div>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-md-4">
            <div className="form-group">
              {this.renderLabeledInput('cvc', 'CVC', 'tel', this.props.cvc, this.props.onCvcChanged, '•••')}
            </div>
          </div>

          <div className="col-sm-6 col-md-4">
            <div className="form-group">
              {this.renderLabeledInput('zip', 'ZIP/Postal Code', 'tel', this.props.zip, this.props.onZipChanged, '')}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PaymentEntry;
