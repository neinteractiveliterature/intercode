class AddSignupAndWithdrawConfirmationTemplates < ActiveRecord::Migration[7.0]
  def up
    Convention.find_each do |convention|
      say "Loading signup and withdraw confirmation templates for #{convention.name}"

      CmsContentLoaders::NotificationTemplates.new(
        cms_parent: convention,
        content_set: CmsContentSet.new(name: "base"),
        content_identifiers: %w[signups/signup_confirmation signups/withdraw_confirmation]
      ).call!
    end
  end

  def down
    NotificationTemplate.where(event_key: %w[signups/signup_confirmation signups/withdraw_confirmation]).destroy_all
  end
end
