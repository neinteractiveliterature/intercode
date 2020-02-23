class Tables::SignupChangesTableResultsPresenter < Tables::TableResultsPresenter
  def self.for_convention(convention, pundit_user, filters = {}, sort = nil, visible_field_ids: nil)
    scope = SignupChangePolicy::Scope.new(pundit_user, convention.signup_changes).resolve
    new(scope, filters, sort, visible_field_ids)
  end

  field :name, 'Name', Tables::SignupsTableResultsPresenter::NameField
  field :event_title, 'Event', Tables::SignupsTableResultsPresenter::EventTitleField
  field :action, 'Action'
  field :prev_state, 'Previous state' do
    def generate_csv_cell(signup_change)
      signup_change.previous_signup_change&.state
    end
  end
  field :state, 'State', Tables::SignupsTableResultsPresenter::StateField
  field :created_at, 'Timestamp'
  field :choice, 'Choice' do
    def generate_csv_cell(signup_change)
      signup_change.signup.counted? ? signup_change.signup.choice : 'N/C'
    end
  end
end
