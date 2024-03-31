# frozen_string_literal: true
class Types::ConventionInputType < Types::BaseInputObject
  argument :accepting_proposals, Boolean, required: false, camelize: false
  argument :catch_all_staff_position_id, ID, required: false, camelize: true
  argument :clickwrap_agreement, String, required: false, camelize: false
  argument :default_currency_code, String, required: false, camelize: true
  argument :default_layout_id, ID, required: false, camelize: true
  argument :domain, String, required: false
  argument :ends_at, Types::DateType, required: false, camelize: false
  argument :event_mailing_list_domain, String, required: false, camelize: false
  argument :email_from, String, required: false, camelize: false
  argument :email_mode, Types::EmailModeType, required: false, camelize: false
  argument :favicon,
           ApolloUploadServer::Upload,
           required: false,
           prepare: ->(upload, _) do
             upload&.__getobj__ # Unwrap value for ActiveStorage
           end
  argument :hidden, Boolean, required: false
  argument :language, String, required: false
  argument :location, Types::JSON, required: false
  argument :maximum_event_signups, Types::ScheduledValueInputType, required: false, camelize: false
  argument :maximum_tickets, Integer, required: false, camelize: false
  argument :name, String, required: false
  argument :open_graph_image,
           ApolloUploadServer::Upload,
           required: false,
           prepare: ->(upload, _) do
             upload&.__getobj__ # Unwrap value for ActiveStorage
           end
  argument :root_page_id, ID, required: false, camelize: true
  argument :show_schedule, Types::ShowScheduleType, required: false, camelize: false
  argument :show_event_list, Types::ShowScheduleType, required: false, camelize: false
  argument :signup_mode, Types::SignupModeType, required: false, camelize: false
  argument :signup_requests_open, Boolean, required: false, camelize: false
  argument :site_mode, Types::SiteModeType, required: false, camelize: false
  argument :starts_at, Types::DateType, required: false, camelize: false
  argument :ticket_name, String, required: false, camelize: false
  argument :ticket_mode, Types::TicketModeType, required: false, camelize: false
  argument :timezone_name, String, required: false, camelize: false
  argument :timezone_mode, Types::TimezoneModeType, required: false, camelize: false
end
