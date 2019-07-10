class Tables::EventProposalsTableResultsPresenter < Tables::TableResultsPresenter
  def self.for_convention(convention, pundit_user, filters, sort, visible_field_ids = nil)
    scope = Pundit.policy_scope(pundit_user, convention.event_proposals.where.not(status: 'draft'))
    new(scope, filters, sort, visible_field_ids)
  end

  def fields
    [
      Tables::TableResultsPresenter::Field.new(:event_category, 'Category'),
      Tables::TableResultsPresenter::Field.new(:title, 'Title'),
      Tables::TableResultsPresenter::Field.new(:owner, 'Submitted by'),
      Tables::TableResultsPresenter::Field.new(:total_slots, 'Capacity'),
      Tables::TableResultsPresenter::Field.new(:length_seconds, 'Duration'),
      Tables::TableResultsPresenter::Field.new(:status, 'Status'),
      Tables::TableResultsPresenter::Field.new(:submitted_at, 'Submitted'),
      Tables::TableResultsPresenter::Field.new(:updated_at, 'Updated')
    ]
  end

  private

  def apply_filter(scope, filter, value)
    case filter
    when :owner
      scope.joins(:owner)
        .where(
          "lower(user_con_profiles.last_name) like :value \
OR lower(user_con_profiles.first_name) like :value",
          value: "%#{value.downcase}%"
        )
    when :title
      scope.where('lower(title) like :value', value: "%#{value.downcase}%")
    when :status
      value.present? ? scope.where(status: value) : scope
    when :event_category
      value.present? ? scope.where(event_category_id: value) : scope
    else
      scope
    end
  end

  def expand_scope_for_sort(scope, sort_field)
    case sort_field
    when :owner
      scope.joins(:owner)
    when :event_category
      scope.joins(:event_category)
    else
      scope
    end
  end

  def sql_order_for_sort_field(sort_field, direction)
    case sort_field
    when :status
      Arel.sql("(status IN ('proposed', 'reviewing')) #{invert_sort_direction direction}, \
status #{direction}")
    when :owner
      Arel.sql("user_con_profiles.last_name #{direction}, \
user_con_profiles.first_name #{direction}")
    when :event_category
      Arel.sql("event_categories.name #{direction}")
    else
      super
    end
  end

  def csv_scope
    scoped.includes(:owner)
  end

  def generate_csv_cell(field, event_proposal)
    case field.id
    when :owner then event_proposal.owner.name_inverted
    when :total_slots then describe_total_slots(event_proposal.registration_policy)
    when :length_seconds then describe_duration(event_proposal.length_seconds)
    when :event_category then event_proposal.event_category.name
    else event_proposal.public_send(field.id)
    end
  end

  def describe_total_slots(registration_policy)
    return 'Unlimited' if registration_policy.slots_unlimited?

    if registration_policy.total_slots == registration_policy.minimum_slots
      registration_policy.total_slots
    else
      "#{registration_policy.minimum_slots}-#{registration_policy.total_slots}"
    end
  end

  def describe_duration(length_seconds)
    hours = (length_seconds / 1.hour).floor
    minutes = (length_seconds / 1.minute) % (1.hour / 1.minute)
    format('%d:%02d', hours, minutes)
  end
end
