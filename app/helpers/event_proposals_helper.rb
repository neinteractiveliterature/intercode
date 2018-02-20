module EventProposalsHelper
  def event_proposal_form(event_proposal)
    react_component(
      'EventProposalForm',
      eventProposalId: event_proposal.id,
      authenticityToken: graphql_authenticity_token,
      afterSubmitUrl: page_path('new-proposal'),
      exitButton: event_proposal_exit_button
    )
  end

  def event_proposal_exit_button
    if params[:exit_url]
      {
        caption: params[:exit_caption] || 'Return',
        url: params[:exit_url]
      }
    else
      {
        caption: 'Return to proposals page',
        url: page_path('new-proposal')
      }
    end
  end
end
