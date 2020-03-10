class Tables::EventProposalsTableResultsPresenter < Tables::TableResultsPresenter
  def self.for_convention(convention, pundit_user, filters, sort, visible_field_ids = nil)
    scope = Pundit.policy_scope(pundit_user, convention.event_proposals.where.not(status: 'draft'))
    new(scope, filters, sort, visible_field_ids)
  end

  def self.describe_duration(length_seconds)
    hours = (length_seconds / 1.hour).floor
    minutes = (length_seconds / 1.minute) % (1.hour / 1.minute)
    format('%d:%02d', hours, minutes)
  end

  field :event_category, 'Category' do
    column_filter :event_category_id

    def expand_scope_for_sort(scope, _direction)
      scope.joins(:event_category)
    end

    def sql_order(direction)
      Arel.sql("event_categories.name #{direction}")
    end

    def generate_csv_cell(event_proposal)
      event_proposal.event_category.name
    end
  end

  field :title, 'Title' do
    def apply_filter(scope, value)
      scope.where('lower(title) like :value', value: "%#{value.downcase}%")
    end
  end

  field :owner, 'Submitted by' do
    def apply_filter(scope, value)
      scope.joins(:owner)
        .where(
          "lower(user_con_profiles.last_name) like :value \
OR lower(user_con_profiles.first_name) like :value",
          value: "%#{value.downcase}%"
        )
    end

    def expand_scope_for_sort(scope, _direction)
      scope.joins(:owner)
    end

    def sql_order(direction)
      Arel.sql("user_con_profiles.last_name #{direction}, \
user_con_profiles.first_name #{direction}")
    end

    def generate_csv_cell(event_proposal)
      event_proposal.owner.name_inverted
    end
  end

  field :total_slots, 'Capacity' do
    def generate_csv_cell(event_proposal)
      registration_policy = event_proposal.registration_policy
      return 'Unlimited' if registration_policy.slots_unlimited?

      if registration_policy.total_slots == registration_policy.minimum_slots
        registration_policy.total_slots
      else
        "#{registration_policy.minimum_slots}-#{registration_policy.total_slots}"
      end
    end
  end

  field :length_seconds, 'Duration' do
    def generate_csv_cell(event_proposal)
      length_seconds = event_proposal.length_seconds
      hours = (length_seconds / 1.hour).floor
      minutes = (length_seconds / 1.minute) % (1.hour / 1.minute)
      format('%d:%02d', hours, minutes)
    end
  end

  field :status, 'Status' do
    column_filter

    def sql_order(direction)
      Arel.sql("(status IN ('proposed', 'reviewing')) #{invert_sort_direction direction}, \
(status IN ('tentative_accept')) #{invert_sort_direction direction}, \
status #{direction}")
    end
  end

  field :submitted_at, 'Submitted'
  field :updated_at, 'Updated'

  private

  def csv_scope
    scoped.includes(:owner, :event_category)
  end
end
