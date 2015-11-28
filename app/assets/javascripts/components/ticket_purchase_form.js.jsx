//= require "jquery.payment"

CARD_TYPE_ICONS = {
  'visa': 'fa-cc-visa',
  'mastercard': 'fa-cc-mastercard',
  'amex': 'fa-cc-amex',
  'dinersclub': 'fa-cc-dinersclub',
  'discover': 'fa-cc-discover',
  'jcb': 'fa-cc-jcb',
  'unknown': 'fa-credit-card'
};

var TicketPurchaseForm = React.createClass({
  getInitialState: function() {
    return {
      paymentError: null,
      ccIconClass: 'fa fa-credit-card',
      submitting: false,
      stripeToken: null,
      ccNumber: "",
      cvc: "",
      expMonth: "",
      expYear: ""
    };
  },

  fieldChanged: function(attribute, e) {
    var stateChange = {};
    stateChange[attribute] = e.target.value;

    this.setState(stateChange);
  },

  checkCardNumber: function(e) {
    var iconClass;
    var backgroundClass;
    var colorClass;
    var cardNumber = e.target.value;

    if (cardNumber && cardNumber.length > 0) {
      var cardType = $.payment.cardType(cardNumber);

      if (cardType) {
        iconClass = CARD_TYPE_ICONS[cardType] || CARD_TYPE_ICONS['unknown'];

        var cardTypeObject = _.find($.payment.cards, function (card) { return card.type == cardType });
        if (_.contains(cardTypeObject.length, cardNumber.replace(/\s/g, '').length)) {
          if ($.payment.validateCardNumber(cardNumber)) {
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

    this.setState({ccIconClass: 'fa ' + iconClass + ' ' + colorClass})
  },

  submitPayment: function(e) {
    e.stopPropagation();
    e.preventDefault();

    this.setState({submitting: true});

    Stripe.card.createToken({
      number: this.state.ccNumber,
      cvc: this.state.cvc,
      exp_month: this.state.expMonth,
      exp_year: this.state.expYear
    }, this.handleStripeResponse);
  },

  handleStripeResponse: function(status, response) {
    var $form = $('[data-payment-form]');

    if (response.error) {
      this.setState({
        paymentError: response.error.message,
        submitting: false
      });
    } else {
      this.setState({ stripeToken: response.id });

      var ticketCreatePromise = $.ajax({
        url: this.props.ticketCreateUrl,
        method: 'POST',
        dataType: 'json',
        data: {
          stripeToken: this.state.stripeToken,
          ticket: {
            ticket_type_id: this.props.ticketTypeId
          }
        }
      });

      ticketCreatePromise.done(function(data, textStatus, jqXHR) {
        window.location.href = this.props.purchaseCompleteUrl;
      }.bind(this));

      ticketCreatePromise.fail(function(jqXHR, textStatus, errorThrown) {
        this.setState({
          paymentError: jqXHR.responseText,
          submitting: false
        });
      }.bind(this));
    }
  },

  render: function() {
    var nextPrice;
    if (this.props.nextPriceChange) {
      var date = new Date(this.props.nextPriceChange.date);
      nextPriceChange = <div>
        <small>({this.props.nextPriceChange.priceFormatted} starting {date.toLocaleDateString()})</small>
      </div>;
    }

    var paymentErrorClass = "alert alert-danger";
    if (!this.state.paymentError) {
      paymentErrorClass += " hidden";
    }

    var ccNumberId = _.uniqueId('cc_number_');
    var cvcId = _.uniqueId('cvc_');

    return <form className="form-horizontal">
      <div className={paymentErrorClass}>
        {this.state.paymentError}
      </div>

      <div className="form-group">
        <label className="control-label col-sm-2">Price</label>
        <div className="form-control-static col-sm-10">
          {this.props.ticketPriceFormatted}
          {nextPriceChange}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor={ccNumberId} className="control-label col-sm-2">Credit card number</label>
        <div className="col-sm-10">
          <div className="input-group">
            <input type="tel"
              id={ccNumberId}
              value={this.state.ccNumber}
              className="form-control"
              onKeyUp={this.checkCardNumber}
              onChange={this.fieldChanged.bind(this, 'ccNumber')}
              placeholder="•••• •••• •••• ••••" />
            <span className="input-group-addon">
              <i className={this.state.ccIconClass}></i>
            </span>
          </div>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor={cvcId} className="control-label col-sm-2">CVC</label>
        <div className="col-sm-10">
          <input type="tel" id={cvcId} value={this.state.cvc} onChange={this.fieldChanged.bind(this, 'cvc')} className="form-control" placeholder="•••" />
        </div>
      </div>

      <div className="form-group">
        <label className="control-label col-sm-2">Expiration date</label>
        <div className="col-sm-10">
          <div className="row">
            <div className="col-xs-4 col-md-2 col-lg-1">
              <input type="tel" value={this.state.expMonth} onChange={this.fieldChanged.bind(this, 'expMonth')} className="form-control" size="2" placeholder="MM" />
            </div>
            <div className="col-xs-8 col-md-4 col-lg-2">
              <input type="tel" value={this.state.expYear} onChange={this.fieldChanged.bind(this, 'expYear')} className="form-control" size="4" placeholder="YYYY" />
            </div>
          </div>
        </div>
      </div>

      <div className="form-group">
        <label className="control-label col-sm-2"></label>
        <div className="col-sm-10">
          <button className="btn btn-primary" disabled={this.state.submitting} onClick={this.submitPayment}>
            Submit payment
            <i className={"fa fa-spinner fa-spin" + (this.state.submitting ? "" : " hidden")}></i>
          </button>
        </div>
      </div>
    </form>;
  }
});