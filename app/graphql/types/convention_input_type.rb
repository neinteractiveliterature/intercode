# frozen_string_literal: true
class Types::ConventionInputType < Types::BaseInputObject
  description "An input for creating or modifying Conventions."

  argument :accepting_proposals, Boolean, required: false, camelize: false do
    description "Is this convention currently accepting event proposals?"
  end
  argument :catch_all_staff_position_id, ID, required: false, camelize: true do
    description "The ID of the StaffPosition to set as the catch-all for inbound emails."
  end
  argument :clickwrap_agreement, String, required: false, camelize: false do
    description "The clickwrap agreement for the convention, in Liquid format."
  end
  argument :default_currency_code, String, required: false, camelize: true do
    description "The ISO 4217 currency code to use as the default for products in this convention."
  end
  argument :default_layout_id, ID, required: false, camelize: true do
    description "The ID of the CmsLayout to use as the default layout for pages in this convention."
  end
  argument :domain, String, required: false do
    description "The domain name to use for serving this convention web site."
  end
  argument :email_from, String, required: false, camelize: false do
    description "The default address to send site emails from."
  end
  argument :email_mode, Types::EmailModeType, required: false, camelize: false do
    description "How this convention site should handle incoming emails to its domain."
  end
  argument :ends_at, Types::DateType, required: false, camelize: false, description: "When this convention ends."
  argument :event_mailing_list_domain, String, required: false, camelize: false do
    description "A domain to use to set up forwarding email addresses for event teams."
  end
  argument :favicon, ApolloUploadServer::Upload, required: false, prepare: :get_apollo_upload_object do
    description "A favicon image to serve to browsers on this site."
  end
  argument :hidden, Boolean, required: false do
    description "Should this event be hidden from CMS content on the root site?"
  end
  argument :language, String, required: false do
    description "The language code to use for localized content in this site (e.g. 'en' for English, 'es' for Spanish)."
  end
  argument :location, Types::JSON, required: false do
    description "The physical location of this convention, in GeoJSON format."
  end
  argument :maximum_event_signups,
           Types::ScheduledValueInputType,
           required: false,
           camelize: false,
           deprecation_reason: "Please use SignupRound instead" do
    description "The schedule of how many signups are allowed in this convention and when."
  end
  argument :maximum_tickets, Integer, required: false, camelize: false do
    description "The maximum number of tickets this convention should be able to sell."
  end
  argument :name, String, required: false, description: "The name of this convention."
  argument :open_graph_image, ApolloUploadServer::Upload, required: false, prepare: :get_apollo_upload_object do
    description <<~MARKDOWN
      The image that should be served from this site using the `<meta property="og:image">` tag.  For more information
      about OpenGraph, see https://ogp.me/.
    MARKDOWN
  end
  argument :root_page_id, ID, required: false, camelize: true do
    description "The ID of the Page to serve at the root path (/) of this convention site."
  end
  argument :show_event_list, Types::ShowScheduleType, required: false, camelize: false do
    description "Who should be able to see the event catalog?"
  end
  argument :show_schedule, Types::ShowScheduleType, required: false, camelize: false do
    description "Who should be able to see the event schedule?"
  end
  argument :signup_automation_mode, Types::SignupAutomationModeType, required: false, camelize: false do
    description "The type of signup automation to use for this convention."
  end
  argument :signup_mode, Types::SignupModeType, required: false, camelize: false do
    description "The signup mode to use for this convention."
  end
  argument :signup_requests_open, Boolean, required: false, camelize: false do
    description "In a moderated-signup convention, should signup requests currently be allowed?"
  end
  argument :site_mode, Types::SiteModeType, required: false, camelize: false do
    description "The mode this convention site should operate in."
  end
  argument :starts_at, Types::DateType, required: false, camelize: false, description: "When this convention starts."
  argument :ticket_mode, Types::TicketModeType, required: false, camelize: false do
    description "The mode to use for ticket behaviors in this convention."
  end
  argument :ticket_name, String, required: false, camelize: false do
    description "The word this convention should use for 'ticket'."
  end
  argument :timezone_mode, Types::TimezoneModeType, required: false, camelize: false do
    description "The mode to use for time zone display and time conversion behavior in this site."
  end
  argument :timezone_name, String, required: false, camelize: false do
    description "The home time zone for this convention."
  end

  def get_apollo_upload_object(upload)
    upload&.__getobj__ # Unwrap value for ActiveStorage
  end
end
