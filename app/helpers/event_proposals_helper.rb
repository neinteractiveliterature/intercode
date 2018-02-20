module EventProposalsHelper
  def event_proposal_form(event_proposal)
    update_authenticity_token = form_authenticity_token(
      form_options: { action: event_proposal_path(event_proposal), method: 'PATCH' }
    )

    submit_authenticity_token = form_authenticity_token(
      form_options: { action: submit_event_proposal_path(event_proposal), method: 'PATCH' }
    )

    react_component(
      'EventProposalForm',
      formUrl: form_url(convention.event_proposal_form),
      conventionUrl: convention_url,
      responseUrl: event_proposal_url(event_proposal),
      responseAuthenticityToken: update_authenticity_token,
      submitAuthenticityToken: submit_authenticity_token,
      graphqlAuthenticityToken: graphql_authenticity_token,
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
