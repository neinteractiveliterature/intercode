var TicketTypeForm = React.createClass({
  render: function() {
    var pricingScheduleFields = (this.props.ticketType.pricing_schedule.timespans || []).map(function (timespan) {
      return (
        <div className="row">
          <div className="col-md-4">
            <div className="form-group">
              <label>
                Start
              </label>
            </div>
          </div>

          <div className="col-md-4">
            <div className="form-group">
              <label>
                Finish
              </label>
            </div>
          </div>

          <div className="col-md-4">
            <div className="form-group">
              <label>
                Amount
              </label>
            </div>
          </div>
        </div>
      );
    });

    return (
      <form>
        <div className="form-group">
          <label htmlFor="name">
            Name (no spaces allowed &mdash; only letters, numbers, and underscores)
          </label>
          <input id="name" type="text" className="form-control" style={{ fontFamily: "monospace" }} value={this.props.ticketType.name}/>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input id="description" type="text" className="form-control" value={this.props.ticketType.description}/>
        </div>

        <fieldset>
          <legend>Pricing schedule</legend>

          {pricingScheduleFields}
        </fieldset>
      </form>
    );
  }
});