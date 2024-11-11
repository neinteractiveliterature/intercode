class UpdateEventUpdatedNotificationHeadline < ActiveRecord::Migration[7.2]
  PREVIOUS_EVENT_UPDATED_BODY_HTML = <<~LIQUID
  <h1>Proposal updated</h1>

  <p>
    “{{ event.title }}” has been updated. To view the event, go
    <a href="{{ event.url | absolute_url }}">here</a>.
  <p>

  <hr>

  <h2>Change log</h2>

  {{ changes_html }}
  LIQUID

  PREVIOUS_EVENT_UPDATED_BODY_TEXT = <<~LIQUID
  “{{ event.title }}” has been updated. To view the event, go to: {{ event.url | absolute_url }}


  A change log is available at: {{ event.history_url | absolute_url }}
  LIQUID

  PREVIOUS_CONTENT = {
    "notification_templates" => {
      "standard" => {
        "events/event_updated" => {
          "body_html" => PREVIOUS_EVENT_UPDATED_BODY_HTML,
          "body_text" => PREVIOUS_EVENT_UPDATED_BODY_TEXT
        }
      }
    }
  }

  def up
    standard = CmsContentSet.new(name: "standard")

    Convention.find_each do |convention|
      content_set = standard

      notification_template_conflict_policy =
        CmsContentLoaders::ConflictPolicies::Update.new(
          PREVIOUS_CONTENT.fetch("notification_templates").fetch(content_set.name)
        )
      notification_template_loader =
        CmsContentLoaders::NotificationTemplates.new(
          cms_parent: convention,
          content_set:,
          content_identifiers: %w[events/event_updated],
          conflict_policy: notification_template_conflict_policy
        )
      notification_template_loader.call!
      notification_template_conflict_policy.skipped_items.each do |skipped_item|
        say "#{convention.name}: #{skipped_item.message}"
      end
    end
  end

  def down
  end
end
