import React, { PropTypes } from 'react';
import CreditCardNumberInput from './CreditCardNumberInput';
import { enableUniqueIds } from 'react-html-id';

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
    disabled: PropTypes.bool
  };

  constructor(props) {
    super(props);
    enableUniqueIds(this);
  }

  render = () => {
    const ccNumberId = this.nextUniqueId();
    const cvcId = this.nextUniqueId();
    const zipId = this.nextUniqueId();

    return (
      <div>
        <CreditCardNumberInput
          id={ccNumberId}
          value={this.props.ccNumber}
          onChange={this.props.onCcNumberChanged}
          disabled={this.props.disabled}
        />

        <div className="row">
          <div className="col-md-4">
            <div className="form-group">
              <label className="control-label">Expiration date</label>
              <div className="row">
                <div className="col">
                  <input type="tel" disabled={this.props.disabled} value={this.props.expMonth} onChange={this.props.onExpMonthChanged} className="form-control" size="2" placeholder="MM" />
                </div>
                <div className="col">
                  <input type="tel" disabled={this.props.disabled} value={this.props.expYear} onChange={this.props.onExpYearChanged} className="form-control" size="4" placeholder="YYYY" />
                </div>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-md-4">
            <div className="form-group">
              <label htmlFor={cvcId} className="control-label">CVC</label>
              <input type="tel" disabled={this.props.disabled} id={cvcId} value={this.props.cvc} onChange={this.props.onCvcChanged} className="form-control" placeholder="•••" />
            </div>
          </div>

          <div className="col-sm-6 col-md-4">
            <div className="form-group">
              <label htmlFor={zipId} className="control-label">ZIP/Postal Code</label>
              <input type="tel" disabled={this.props.disabled} id={zipId} value={this.props.zip} onChange={this.props.onZipChanged} className="form-control" placeholder="" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PaymentEntry;