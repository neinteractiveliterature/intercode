require 'mail'

module EventEmail
  extend ActiveSupport::Concern

  included do
    validate :team_mailing_list_name_must_not_be_taken
    validate :team_mailing_list_name_must_not_be_reserved
    validate :cannot_use_mailing_list_domain_manually
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
    "#{read_form_response_attribute(:team_mailing_list_name)}@" +
      convention.event_mailing_list_domain.to_s
  end

  def event_mailing_list_domain_suffix
    return nil unless convention.event_mailing_list_domain.present?
    "@#{convention.event_mailing_list_domain}"
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

    errors.add :event_email, "#{team_mailing_list_email} is a reserved email address \
and cannot be used for an event team"
  end

  def team_mailing_list_name_must_not_be_taken
    return unless team_mailing_list_name.present?

    [Event, EventProposal].each do |model_class|
      scope = other_models_for_team_mailing_list_conflicts(model_class)
        .where(team_mailing_list_name: team_mailing_list_name)
      next unless scope.any?

      errors.add :event_email, "#{team_mailing_list_email} is already in use by another \
event (#{scope.map(&:title).to_sentence})"
      break
    end
  end

  def cannot_use_mailing_list_domain_manually
    return unless event_mailing_list_domain_suffix
    return unless event_email
    return if event_email[:team_mailing_list_name]
    return unless event_email[:email].end_with?(event_mailing_list_domain_suffix)

    errors.add :event_email, "Cannot use the @#{convention.event_mailing_list_domain} domain \
without setting “Have the convention create and manage a team mailing list for me”"
  end

  def other_models_for_team_mailing_list_conflicts(model_class)
    scope = model_class.where(convention_id: convention_id)
    scope = scope.where.not(id: id) if persisted? && is_a?(model_class)

    scope
  end
end
