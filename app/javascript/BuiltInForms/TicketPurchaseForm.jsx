/* global Stripe */

import React from 'react';
import PropTypes from 'prop-types';
import { enableUniqueIds } from 'react-html-id';
import PaymentEntry from '../BuiltInFormControls/PaymentEntry';
import { performRequest } from '../HTTPUtils';
import PoweredByStripeLogo from '../images/powered_by_stripe.svg';

class TicketPurchaseForm extends React.Component {
  static propTypes = {
    ticketTypes: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      formattedPrice: PropTypes.string.isRequired,
      available: PropTypes.bool.isRequired,
    })).isRequired,
    createChargeUrl: PropTypes.string.isRequired,
    purchaseCompleteUrl: PropTypes.string.isRequired,
    ticketTypeId: PropTypes.number,
    initialName: PropTypes.string,
  };

  static defaultProps = {
    ticketTypeId: '',
    initialName: '',
  };

  constructor(props) {
    super(props);

    this.state = {
      paymentError: null,
      submitting: false,
      stripeToken: null,
      ticketTypeId: (this.props.ticketTypeId || '').toString(),
      ccNumber: '',
      cvc: '',
      expMonth: '',
      expYear: '',
      zip: '',
      name: props.initialName || '',
    };

    enableUniqueIds(this);
  }

  getTicketType = () => {
    const ticketTypeId = Number.parseInt(this.state.ticketTypeId, 10);

    return this.props.ticketTypes.find(ticketType => ticketType.id === ticketTypeId);
  }

  submitPayment = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const missingFields = [
      'ccNumber',
      'cvc',
      'expMonth',
      'expYear',
      'zip',
      'name',
    ].filter(field => !this.state[field]);

    if (missingFields.length > 0) {
      this.setState({ paymentError: 'Please fill out all the fields in this form.' });
      return;
    }

    this.setState({ submitting: true });

    Stripe.card.createToken({
      number: this.state.ccNumber,
      cvc: this.state.cvc,
      exp_month: this.state.expMonth,
      exp_year: this.state.expYear,
      name: this.state.name,
      address_zip: this.state.zip,
    }, this.handleStripeResponse);
  }

  fieldChanged = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleStripeResponse = (status, response) => {
    if (response.error) {
      this.setState({
        paymentError: response.error.message,
        submitting: false,
      });
    } else {
      this.setState({ stripeToken: response.id });

      performRequest(this.props.createChargeUrl, {
        method: 'POST',
        body: {
          stripeToken: this.state.stripeToken,
          ticket: {
            ticket_type_id: this.state.ticketTypeId,
            name: this.state.name,
          },
        },
      }).then(() => {
        window.location.href = this.props.purchaseCompleteUrl;
      }).catch((error) => {
        error.response.json().then((json) => {
          this.setState({
            paymentError: json.errors.base.join(', '),
            submitting: false,
          });
        });
      });
    }
  }

  isDisabled = () => ((!this.state.ticketTypeId) || this.state.submitting);

  renderPaymentError = () => {
    if (!this.state.paymentError) {
      return null;
    }

    return (
      <div className="alert alert-danger">
        {this.state.paymentError}
      </div>
    );
  }

  renderTicketTypeSelect = () => {
    const options = this.props.ticketTypes.map((ticketType) => {
      let description = `${ticketType.name} (${ticketType.formattedPrice})`;
      if (!ticketType.available) {
        description += ' - SOLD OUT';
      }

      let formCheckClass = 'form-check';
      if (!ticketType.available) {
        formCheckClass += ' disabled';
      }

      const radioId = this.nextUniqueId();

      return (
        <div className={formCheckClass} key={ticketType.id}>
          <label className="form-check-label" htmlFor={radioId}>
            <input
              type="radio"
              className="form-check-input"
              value={ticketType.id}
              id={radioId}
              name="ticketTypeId"
              disabled={!ticketType.available}
              checked={this.state.ticketTypeId === ticketType.id.toString()}
              onChange={this.fieldChanged}
            />
            &nbsp;
            {description}
          </label>
        </div>
      );
    });

    return options;
  }

  renderFormGroup = (name, label, type, value) => {
    const inputId = this.nextUniqueId();

    return (
      <div className="form-group">
        <label htmlFor={inputId}>{label}</label>
        <input
          className="form-control"
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={this.fieldChanged}
          disabled={this.isDisabled()}
        />
      </div>
    );
  }

  renderPaymentSection = () => {
    const disabled = this.isDisabled();

    return (
      <div>
        <hr />
        {this.renderPaymentError()}

        {this.renderFormGroup('name', 'Name', 'text', this.state.name)}

        <PaymentEntry
          ccNumber={this.state.ccNumber}
          expMonth={this.state.expMonth}
          expYear={this.state.expYear}
          cvc={this.state.cvc}
          zip={this.state.zip}
          onCcNumberChanged={this.fieldChanged}
          onExpMonthChanged={this.fieldChanged}
          onExpYearChanged={this.fieldChanged}
          onCvcChanged={this.fieldChanged}
          onZipChanged={this.fieldChanged}
          disabled={disabled}
        />

        <div className="d-flex justify-content-end align-items-center">
          <img src={PoweredByStripeLogo} alt="Powered by Stripe" className="mr-4" />
          <button
            className="btn btn-primary"
            onClick={this.submitPayment}
            disabled={disabled}
          >
            Submit payment
            {this.renderSubmittingSpinner()}
          </button>
        </div>
      </div>
    );
  }

  renderSubmittingSpinner = () => {
    if (!this.state.submitting) {
      return null;
    }

    return <i className="fa fa-spinner fa-spin" />;
  }

  render = () => (
    <form>
      {this.renderTicketTypeSelect()}
      {this.renderPaymentSection()}
    </form>
  );
}

export default TicketPurchaseForm;
