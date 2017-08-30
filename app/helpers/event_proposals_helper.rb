module EventProposalsHelper
  def event_proposal_form(event_proposal)
    update_authenticity_token = form_authenticity_token(
      form_options: { action: event_proposal_path(event_proposal), method: 'PATCH' }
    )

    submit_authenticity_token = form_authenticity_token(
      form_options: { action: submit_event_proposal_path(event_proposal), method: 'PATCH' }
    )

    react_component(
      'FormPresenter',
      formUrl: form_url(convention.event_proposal_form),
      conventionUrl: convention_url,
      responseUrl: event_proposal_url(event_proposal),
      authenticityToken: update_authenticity_token,
      submitAuthenticityToken: submit_authenticity_token,
      afterSubmitUrl: page_path('new-proposal')
    )
  end
end
