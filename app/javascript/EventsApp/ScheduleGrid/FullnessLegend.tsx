import React from 'react';

function FullnessLegend() {
  return (
    <div className="d-flex flex-wrap">
      <div className="col-md-6 col-lg-4 mb-4">
        <div className="card bg-light">
          <div className="card-header">
            Event fullness colors
          </div>

          <div className="card-body">
            {[
              { className: 'below-minimum', label: 'Below minimum' },
              { className: 'minimum', label: 'Reached minimum' },
              { className: 'preferred', label: 'Reached preferred' },
              { className: 'full', label: 'Full' },
              { className: 'unlimited', label: 'Unlimited capacity' },
            ].map(({ className, label }) => (
              <div className={`px-2 event-fullness-${className}`} key={className}>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="col-md-6 col-lg-4 mb-4">
        <div className="card bg-light">
          <div className="card-header">
            Attendee counts
          </div>

          <div className="card-body">
            <small className="text-muted">
              <div>min/preferred/max</div>
              <div>
                <abbr className="text-success" title="confirmed signups">conf</abbr>
                /
                <abbr className="text-info" title="non-counted signups (usually staff or NPCs)">nocount</abbr>
                /
                <abbr className="text-danger" title="waitlisted signups">waitlist</abbr>
              </div>
              <div>
                Total: [total of above 3 numbers]
              </div>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FullnessLegend;
