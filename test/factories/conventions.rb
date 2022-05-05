# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: conventions
#
#  id                             :bigint           not null, primary key
#  accepting_proposals            :boolean
#  canceled                       :boolean          default(FALSE), not null
#  clickwrap_agreement            :text
#  domain                         :string           not null
#  email_from                     :text             not null
#  email_mode                     :string           default("forward"), not null
#  ends_at                        :datetime
#  event_mailing_list_domain      :text
#  favicon                        :text
#  hidden                         :boolean          default(FALSE), not null
#  language                       :string           not null
#  location                       :jsonb
#  maximum_event_signups          :jsonb
#  maximum_tickets                :integer
#  name                           :string
#  open_graph_image               :text
#  show_event_list                :string           default("no"), not null
#  show_schedule                  :string           default("no"), not null
#  signup_mode                    :string           default("self_service"), not null
#  signup_requests_open           :boolean          default(FALSE), not null
#  site_mode                      :string           default("convention"), not null
#  starts_at                      :datetime
#  stripe_account_ready_to_charge :boolean          default(FALSE), not null
#  ticket_mode                    :string           default("disabled"), not null
#  ticket_name                    :string           default("ticket"), not null
#  timezone_mode                  :string           not null
#  timezone_name                  :string
#  created_at                     :datetime
#  updated_at                     :datetime
#  catch_all_staff_position_id    :bigint
#  default_layout_id              :bigint
#  organization_id                :bigint
#  root_page_id                   :bigint
#  stripe_account_id              :text
#  updated_by_id                  :bigint
#  user_con_profile_form_id       :bigint
#
# Indexes
#
#  index_conventions_on_catch_all_staff_position_id  (catch_all_staff_position_id)
#  index_conventions_on_default_layout_id            (default_layout_id)
#  index_conventions_on_domain                       (domain) UNIQUE
#  index_conventions_on_organization_id              (organization_id)
#  index_conventions_on_updated_by_id                (updated_by_id)
#  index_conventions_on_user_con_profile_form_id     (user_con_profile_form_id)
#
# Foreign Keys
#
#  fk_rails_...  (catch_all_staff_position_id => staff_positions.id)
#  fk_rails_...  (default_layout_id => cms_layouts.id)
#  fk_rails_...  (organization_id => organizations.id)
#  fk_rails_...  (root_page_id => pages.id)
#  fk_rails_...  (updated_by_id => users.id)
#  fk_rails_...  (user_con_profile_form_id => forms.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective
FactoryBot.define do
  factory :convention do
    name { 'TestCon' }
    sequence(:domain) { |n| "testcon#{n}.example.com" }
    timezone_name { 'UTC' }
    timezone_mode { 'convention_local' }
    show_schedule { 'yes' }
    show_event_list { 'yes' }
    accepting_proposals { false }
    language { 'en' }
    updated_by { nil }
    maximum_event_signups do
      ScheduledValue::ScheduledValue.new(timespans: [{ start: nil, finish: nil, value: 'unlimited' }])
    end
    starts_at { Time.utc(2016, 10, 28, 18, 0, 0) }
    ends_at { Time.utc(2016, 10, 30, 18, 0, 0) }
    stripe_account_id { "acct_#{Devise.friendly_token}" }

    after(:build) do |convention|
      convention.user_con_profile_form ||= convention.build_user_con_profile_form(form_type: 'user_con_profile')
      convention.email_from ||= "noreply@#{convention.domain}"
    end

    trait :with_notification_templates do
      after(:create) do |convention|
        content_set = CmsContentSet.new(name: 'standard')
        CmsContentLoaders::CmsPartials.new(cms_parent: convention, content_set: content_set).call!
        CmsContentLoaders::NotificationTemplates.new(cms_parent: convention, content_set: content_set).call!
      end
    end

    trait :with_standard_content do
      after(:create) do |convention|
        convention.forms.destroy_all
        convention.update!(user_con_profile_form: nil)
        LoadCmsContentSetService.new(convention: convention, content_set_name: 'standard').call!
      end
    end
  end
end
