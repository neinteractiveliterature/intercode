class Types::CmsPartialBlockName < Types::BaseEnum
  description "Reserved names for partials that will automatically be shown on certain pages if present"

  value "ACCOUNT_FORM_TEXT", value: "account_form_text", description: <<~MARKDOWN
    Content shown on top of the "update your account" and "create your account" forms. This is used by the "update your
    account" pages as a way to clarify that your account is shared between multiple conventions.
  MARKDOWN

  value "MY_SIGNUP_QUEUE_TEXT", value: "my_signup_queue_text", description: <<~MARKDOWN
    Content shown on top of the "my signup queue" page.
  MARKDOWN

  value "PRE_SCHEDULE_TEXT", value: "pre_schedule_text", description: <<~MARKDOWN
    Content shown on top of the convention schedule.
  MARKDOWN

  def self.retrieve(name:, cms_parent:)
    case name
    when "account_form_text"
      CmsPartial.global.find_by(name:)
    else
      cms_parent.cms_partials.find_by(name:)
    end
  end
end
