class Tables::SignupRequestsTableResultsPresenter < Tables::TableResultsPresenter
  def self.for_convention(convention:, ability:, filters: {}, sort: nil, visible_field_ids: nil)
    scope = convention.signup_requests.accessible_by(ability)
    new(
      base_scope: scope,
      convention: convention,
      ability: ability,
      filters: filters,
      sort: sort,
      visible_field_ids: visible_field_ids
    )
  end

  attr_reader :ability, :convention

  def initialize(base_scope:, convention:, ability:, filters: {}, sort: nil, visible_field_ids: nil)
    super(base_scope, filters, sort, visible_field_ids)
    @convention = convention
    @ability = ability
  end

  def fields
    []
  end

  private

  def apply_filter(scope, filter, value)
    case filter
    when :state
      value.present? ? scope.where(state: value) : scope
    else
      scope
    end
  end

  def sql_order_for_sort_field(sort_field, direction)
    case sort_field
    when :state
      <<~SQL
      (
        CASE
        WHEN state = 'pending' THEN 0
        WHEN state = 'accepted' THEN 1
        WHEN state = 'rejected' THEN 2
        WHEN state = 'withdrawn' THEN 3
        END
      )
      SQL
    else
      super
    end
  end
end
