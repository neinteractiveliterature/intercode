# frozen_string_literal: true
class Tables::SignupChangesTableResultsPresenter < Tables::TableResultsPresenter
  def self.for_convention(convention, pundit_user, filters = {}, sort = nil, visible_field_ids: nil)
    scope = SignupChangePolicy::Scope.new(pundit_user, convention.signup_changes).resolve
    new(scope, filters, sort, visible_field_ids)
  end

  field :name, "Name", Tables::SignupsTableResultsPresenter::NameField
  field :event_title, "Event", Tables::SignupsTableResultsPresenter::EventTitleField
  field :action, "Action" do
    column_filter
  end
  field :prev_state, "Previous state" do
    def generate_csv_cell(signup_change)
      signup_change.previous_signup_change&.state
    end
  end
  field :state, "State", Tables::SignupsTableResultsPresenter::StateField
  field :bucket, "Bucket" do
    def generate_csv_cell(signup_change)
      Tables::SignupChangesTableResultsPresenter.format_bucket_names(
        signup_change.bucket_name,
        signup_change.requested_bucket_name
      )
    end
  end
  field :prev_bucket, "Previous bucket" do
    def generate_csv_cell(signup_change)
      previous_signup_change = signup_change.previous_signup_change
      return nil unless previous_signup_change

      Tables::SignupChangesTableResultsPresenter.format_bucket_names(
        previous_signup_change.bucket_name,
        previous_signup_change.requested_bucket_name
      )
    end
  end
  field :created_at, "Timestamp"
  field :choice, "Choice" do
    def generate_csv_cell(signup_change)
      signup_change.signup.counted? ? signup_change.signup.choice : "N/C"
    end
  end

  # Uses the bucket_name/requested_bucket_name snapshots taken at the time of the change (rather
  # than resolving signup_change.bucket/requested_bucket live) so this table keeps showing the
  # bucket's name as of that point in time even after the bucket itself is renamed or removed.
  def self.format_bucket_names(bucket_name, requested_bucket_name)
    return "#{bucket_name} (no preference)" if bucket_name && !requested_bucket_name
    if requested_bucket_name && bucket_name != requested_bucket_name
      return "#{bucket_name || "None"} (requested #{requested_bucket_name})"
    end
    bucket_name
  end
end
