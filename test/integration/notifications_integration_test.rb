require 'test_helper'

class NotificationsIntegrationTest < ActiveSupport::TestCase
  let(:convention) do
    create(:convention, :with_standard_content).tap do |c|
      user_con_profile = create(:user_con_profile, convention: c)
      event_form = c.forms.find_by!(form_type: 'event')
      event_proposal_form = c.forms.find_by!(form_type: 'event_proposal')
      event_category = create(
        :event_category,
        convention: c,
        event_proposal_form: event_proposal_form,
        event_form: event_form
      )
      event_proposal = create(:event_proposal, convention: c, event_category: event_category)
      event = create(:event, convention: c, event_category: event_category)
      [[event_proposal, event_proposal_form], [event, event_form]].each do |(form_response, form)|
        form_response.form_response_changes.create!(
          field_identifier: form.form_items.where.not(identifier: nil).first.identifier,
          user_con_profile: user_con_profile
        )
      end
      the_run = create(:run, event: event)
      create(:signup, run: the_run)
      create(:signup_request, target_run: the_run)
      create(:ticket, user_con_profile: user_con_profile)
    end
  end

  Notifier::NOTIFICATIONS_CONFIG['categories'].each do |category|
    category['events'].each do |event|
      event_key = "#{category['key']}/#{event['key']}"
      describe event_key do
        it 'renders without errors' do
          notifier = NotifierPreviewFactory.new(
            convention: convention, event_key: event_key
          ).notifier

          notifier.render
        end

        if %w[events event_proposals].include?(category['key'])
          it 'can be overridden using an event category-specific template' do
            notifier = NotifierPreviewFactory.new(
              convention: convention, event_key: event_key
            ).notifier

            event_category = convention.event_categories.first
            convention.notification_templates.create!(
              event_key: event_key,
              notification_context: event_category,
              subject: 'blah',
              body_html: 'blah',
              body_text: 'blah'
            )

            assert_equal 'blah', notifier.render[:subject]
          end
        end
      end
    end
  end
end
