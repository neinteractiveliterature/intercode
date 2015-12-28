var TicketTypeForm = React.createClass({
  getInitialState: function() {
    return {
      ticketType: this.props.initialTicketType
    }
  },

  isUpdate: function() {
    return this.state.ticketType.id;
  },

  resourceUrl: function() {
    if (this.state.ticketType.id) {
      return this.props.baseUrl + "/" + this.state.ticketType.id;
    } else {
      return this.props.baseUrl;
    }
  },

  setTicketTypeAttribute: function(attribute, value) {
    var newAttributes = _.clone(this.state.ticketType);
    newAttributes[attribute] = value;

    this.setState({ ticketType: newAttributes });
  },

  submitClicked: function(e) {
    e.preventDefault();

    var method = 'POST';
    if (this.isUpdate()) {
      method = 'PATCH';
    }

    var promise = $.ajax(
      {
        url: this.resourceUrl(),
        type: method,
        data: {
          ticket_type: this.state.ticketType
        },
        dataType: 'json'
      }
    );

    promise.done(function(data, textStatus, jqXHR) {
      window.location.href = this.props.baseUrl;
    });

    promise.fail(function(jqXHR, status, errorThrown) {
      alert(jqXHR.responseText);
    });
  },

  render: function() {
    return (
      <form>
        <div className="form-group">
          <label htmlFor="name">
            Name (no spaces allowed &mdash; only letters, numbers, and underscores)
          </label>
          <input id="name" type="text" className="form-control" style={{ fontFamily: "monospace" }} value={this.state.ticketType.name}/>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input id="description" type="text" className="form-control" value={this.state.ticketType.description}/>
        </div>

        <fieldset>
          <label>Pricing schedule</label>

          <ScheduledValueEditor
            scheduledValue={this.state.ticketType.pricing_schedule}
            setScheduledValue={this.setTicketTypeAttribute.bind(this, 'pricing_schedule')} />
        </fieldset>

        <div class="form-group">
          <input type="submit" onClick={this.submitClicked} className="btn btn-primary" value="Save ticket type configuration"/>
        </div>
      </form>
    );
  }
});