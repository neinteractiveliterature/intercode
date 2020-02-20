require 'mail'

module EventEmail
  extend ActiveSupport::Concern

  included do
    validate :team_mailing_list_name_must_not_be_taken
    validate :team_mailing_list_name_must_not_be_reserved
  end

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

  def reserved_team_mailing_list_names
    convention.staff_positions.map do |staff_position|
      next unless staff_position.email
      address = Mail::Address.new(staff_position.email)
      address.local
    end.compact
  end

  def team_mailing_list_name_must_not_be_reserved
    return unless team_mailing_list_name.present?
    return unless reserved_team_mailing_list_names.include?(team_mailing_list_name)

    errors.add :team_mailing_list_name, "#{team_mailing_list_email} is a reserved email address \
and cannot be used for an event team"
  end

  def team_mailing_list_name_must_not_be_taken
    return unless team_mailing_list_name.present?

    [Event, EventProposal].each do |model_class|
      scope = model_class.where(
        team_mailing_list_name: team_mailing_list_name, convention_id: convention_id
      )
      scope = scope.where.not(id: id) if persisted? && is_a?(model_class)
      scope = scope.where.not(event_id: id) if is_a?(Event) && model_class == EventProposal
      if is_a?(EventProposal) && model_class == Event && event_id
        scope = scope.where.not(id: event_id)
      end

      next unless scope.any?

      errors.add :team_mailing_list_name, "#{team_mailing_list_email} is already in use by another \
event"
      break
    end
  end
end
