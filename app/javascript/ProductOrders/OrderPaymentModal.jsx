import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Modal from 'react-bootstrap4-modal';
import createStripeToken from './createStripeToken';
import ErrorDisplay from '../ErrorDisplay';
import MultipleChoiceInput from '../BuiltInFormControls/MultipleChoiceInput';
import OrderPaymentForm from './OrderPaymentForm';
import paymentDetailsComplete from './paymentDetailsComplete';
import PoweredByStripeLogo from '../images/powered_by_stripe.svg';

const submitOrderMutation = gql`
mutation($input: SubmitOrderInput!) {
  submitOrder(input: $input) {
    order {
      id
      status
    }
  }
}
`;

@graphql(submitOrderMutation, {
  props: ({ mutate }) => ({
    submitOrder: (orderId, paymentMode, stripeToken) => mutate({
      variables: {
        input: {
          id: orderId,
          payment_mode: paymentMode,
          stripe_token: stripeToken,
        },
      },
    }),
  }),
})
class OrderPaymentModal extends React.Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onComplete: PropTypes.func.isRequired,
    initialName: PropTypes.string,
    submitOrder: PropTypes.func.isRequired,
    orderId: PropTypes.number.isRequired,
    allowPayLater: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    initialName: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      paymentError: null,
      submitting: false,
      paymentMode: props.allowPayLater ? null : 'now',
      paymentDetails: {
        ccNumber: '',
        cvc: '',
        expMonth: '',
        expYear: '',
        zip: '',
        name: props.initialName || '',
      },
    };
  }

  paymentDetailsChanged = (paymentDetails) => { this.setState({ paymentDetails }); }
  paymentModeChanged = (paymentMode) => { this.setState({ paymentMode }); }

  submitCheckOutViaStripe = async () => {
    try {
      this.setState({ submitting: true });
      const stripeToken = await createStripeToken(this.state.paymentDetails);

      try {
        await this.props.submitOrder(this.props.orderId, this.state.paymentMode, stripeToken);
        this.props.onComplete();
      } catch (error) {
        this.setState({ graphQLError: error, submitting: false });
      }
    } catch (error) {
      this.setState({ paymentError: error.message, submitting: false });
    }
  }

  submitPayLaterCheckOut = async () => {
    try {
      this.setState({ submitting: true });
      await this.props.submitOrder(this.props.orderId, this.state.paymentMode);
      this.props.onComplete();
    } catch (error) {
      this.setState({ graphQLError: error, submitting: false });
    }
  }

  submitCheckOut = () => {
    if (this.state.paymentMode === 'now') {
      this.submitCheckOutViaStripe();
    } else if (this.state.paymentMode === 'later') {
      this.submitPayLaterCheckOut();
    }
  }

  renderCheckOutModalContent = () => {
    if (!this.props.visible) {
      return null;
    }

    let paymentModeSelect = null;

    if (this.props.allowPayLater) {
      paymentModeSelect = (
        <MultipleChoiceInput
          name="paymentMode"
          caption="How would you like to pay for your order?"
          value={this.state.paymentMode}
          onChange={this.paymentModeChanged}
          choices={[
            { value: 'now', label: 'Pay now with a credit card' },
            { value: 'later', label: 'Pay at the convention' },
          ]}
        />
      );
    }

    return (
      <div className="modal-body">
        {paymentModeSelect}
        {
          this.state.paymentMode === 'now' ?
          (
            <OrderPaymentForm
              paymentDetails={this.state.paymentDetails}
              onChange={this.paymentDetailsChanged}
              disabled={this.state.submitting}
            />
          ) :
          null
        }
        <ErrorDisplay
          stringError={this.state.paymentError}
          graphQLError={this.state.graphQLError}
        />
      </div>
    );
  }

  render = () => {
    const disabled = !this.state.paymentMode || this.state.submitting || (
      this.state.paymentMode === 'now' && !paymentDetailsComplete(this.state.paymentDetails)
    );

    return (
      <Modal visible={this.props.visible} dialogClassName="modal-lg">
        <div className="modal-header lead">Checkout</div>
        {this.renderCheckOutModalContent()}
        <div className="modal-footer">
          <div className="d-flex align-items-center">
            <div className="col">
              {
                this.state.paymentMode === 'now' ?
                (
                  <img src={PoweredByStripeLogo} alt="Powered by Stripe" className="mr-4" />
                ) : null
              }
            </div>
            <button
              className="btn btn-secondary mr-2"
              onClick={this.props.onCancel}
              disabled={this.state.submitting}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={this.submitCheckOut}
              disabled={disabled}
            >
              Submit
            </button>
          </div>
        </div>
      </Modal>
    );
  }
}

export default OrderPaymentModal;
