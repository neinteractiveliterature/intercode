//= require 'moment'
//= require 'react-datetime'

var TimespanRow = React.createClass({
  render: function() {
    var startTime = null;
    var finishTime = null;
    var dollarValue = null;

    if (this.props.timespan.start) {
      startTime = moment(this.props.timespan.start);
    }

    if (this.props.timespan.finish) {
      finishTime = moment(this.props.timespan.finish);
    }

    if (this.props.timespan.value && this.props.timespan.value.fractional !== null) {
      dollarValue = (this.props.timespan.value.fractional / 100.0).toFixed(2);
    }

    return (
      <tr>
        <td className="col-md-3">
          <div className="input-group">
            <span className="input-group-addon">$</span>
            <input type="number" className="form-control" value={dollarValue} />
          </div>
        </td>

        <td className="col-md-4">
          <div className="input-group">
            <span className="input-group-addon">from</span>
            <Datetime value={startTime} />
          </div>
        </td>

        <td className="col-md-4">
          <div className="input-group">
            <span className="input-group-addon">to</span>
            <Datetime value={finishTime} />
          </div>
        </td>

        <td className="col-md-1 text-right">
          <button className="btn btn-danger" onClick={this.props.deleteClicked}>
            <i className="fa fa-trash-o"/>
          </button>
        </td>
      </tr>
    );
  }
});

var ScheduledValueEditor = React.createClass({
  addRowClicked: function(e) {
    e.preventDefault();

    var newTimespans = _.clone(this.props.scheduledValue.timespans);
    newTimespans.push({ start: null, finish: null, value: null });

    this.setTimespans(newTimespans);
  },

  deleteRowClicked: function(index, e) {
    e.preventDefault();

    var oldTimespans = this.props.scheduledValue.timespans;
    var newTimespans = oldTimespans.slice(0, index).concat(oldTimespans.slice(index + 1));

    this.setTimespans(newTimespans);
  },

  setTimespans: function(newTimespans) {
    var newScheduledValue = _.extend(_.clone(this.props.scheduledValue), {timespans: newTimespans});
    this.props.setScheduledValue(newScheduledValue);
  },

  render: function() {
    var timespanRows = (this.props.scheduledValue.timespans || []).map(function (timespan, i) {
      return <TimespanRow
        timespan={timespan}
        key={i}
        deleteClicked={this.deleteRowClicked.bind(this, i)}/>;
    }.bind(this));

    return (
      <table className="table table-striped">
        <tbody>
          {timespanRows}
          <tr>
            <td colSpan="3">
              <button className="btn btn-link" onClick={this.addRowClicked}>Add row</button>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
});