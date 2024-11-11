# frozen_string_literal: true
class CloneConventionService < CivilService::Service
  class Result < CivilService::Result
    attr_accessor :convention
  end
  self.result_class = Result

  attr_reader :source_convention, :new_convention_attributes

  def initialize(source_convention:, new_convention_attributes:)
    @source_convention = source_convention
    @new_convention_attributes = { show_schedule: "no", accepting_proposals: false }.merge(
      source_convention.attributes.symbolize_keys.slice(
        *%i[
          language
          maximum_tickets
          ticket_name
          ticket_mode
          timezone_name
          timezone_mode
          signup_automation_mode
          stripe_account_id
          clickwrap_agreement
          hidden
          cms_content_set_name
        ]
      )
    ).merge(new_convention_attributes.symbolize_keys)
  end

  private

  def inner_call
    convention = Convention.new(new_convention_attributes)

    ActiveRecord::Base.transaction do
      id_maps = {}

      [
        ContentCloners::ConventionCloner,
        ContentCloners::SignupRoundsCloner,
        ContentCloners::CmsContentCloner,
        ContentCloners::DepartmentsCloner,
        ContentCloners::EventCategoriesCloner,
        ContentCloners::RoomsCloner,
        ContentCloners::TicketTypesCloner,
        ContentCloners::StaffPositionsCloner,
        ContentCloners::StoreContentCloner,
        ContentCloners::UserActivityAlertsCloner
      ].each do |cloner_class|
        cloner = cloner_class.new(source_convention, id_maps)
        cloner.clone(convention)
        id_maps.merge!(cloner.id_maps)
      end
    end

    success(convention:)
  end
end
