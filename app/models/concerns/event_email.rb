module Concerns::EventEmail
  def event_email
    {
      con_mail_destination: read_form_response_attribute(:con_mail_destination),
      email: read_form_response_attribute(:email),
      team_mailing_list_name: read_form_response_attribute(:team_mailing_list_name)
    }
  end

  def event_email=(attributes)
    symbolized_attributes = attributes.symbolize_keys
    if symbolized_attributes[:team_mailing_list_name]
      assign_form_response_attributes(
        team_mailing_list_name: symbolized_attributes[:team_mailing_list_name]
      )
      assign_form_response_attributes(
        con_mail_destination: 'event_email',
        email: team_mailing_list_email
      )
    else
      assign_form_response_attributes(symbolized_attributes)
    end
    event_email
  end

  def team_mailing_list_email
    "#{read_form_response_attribute(:team_mailing_list_name)}@#{convention.event_mailing_list_domain}"
  end
end
