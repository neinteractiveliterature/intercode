import React from 'react';
import PropTypes from 'prop-types';
import { injectStripe, CardElement } from 'react-stripe-elements';

import LoadingIndicator from '../LoadingIndicator';
import PoweredByStripeLogo from '../images/powered_by_stripe.svg';

class TicketPurchasePaymentSection extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    onReceiveToken: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
    stripe: PropTypes.shape({
      createToken: PropTypes.func.isRequired,
    }).isRequired,
    submitting: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      submitting: false,
    };
  }

  submitPayment = async () => {
    try {
      this.setState({ submitting: true });
      const { token, error } = await this.props.stripe.createToken({ name: this.props.name });

      if (error) {
        this.props.onError(error);
      } else {
        this.props.onReceiveToken(token);
      }
    } catch (error) {
      this.props.onError(error);
    } finally {
      this.setState({ submitting: false });
    }
  }

  render = () => {
    const disabled = this.props.disabled || this.state.submitting;

    return (
      <div>
        <CardElement
          className="form-control mb-4"
          disabled={disabled}
          style={{
            base: {
              lineHeight: 1.5,
              fontSize: '16px',
            },
          }}
        />

        <div className="d-flex justify-content-end align-items-center">
          <img src={PoweredByStripeLogo} alt="Powered by Stripe" className="mr-4" />
          <button
            className="btn btn-primary"
            onClick={this.submitPayment}
            disabled={disabled}
            type="submit"
          >
            {
              this.state.submitting || this.props.submitting
                ? <LoadingIndicator />
                : 'Submit payment'
            }
          </button>
        </div>
      </div>
    );
  }
}

export default injectStripe(TicketPurchasePaymentSection);
