module AdminEventProposalsHelper
  def event_proposal_badge_class(event_proposal)
    case event_proposal.status
    when 'proposed' then 'badge-light'
    when 'reviewing' then 'badge-info'
    when 'accepted' then 'badge-success'
    when 'rejected' then 'badge-danger'
    when 'withdrawn' then 'badge-warning'
    end
  end
end
