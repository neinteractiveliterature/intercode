class Tables::EventsTableResultsPresenter < Tables::TableResultsPresenter
  def self.for_convention(convention:, pundit_user:, filters: {}, sort: nil, visible_field_ids: nil)
    scope = Pundit.policy_scope(
      pundit_user, convention.events.where(status: 'active').includes(:convention)
    )
    new(
      base_scope: scope,
      convention: convention,
      pundit_user: pundit_user,
      filters: filters,
      sort: sort,
      visible_field_ids: visible_field_ids
    )
  end

  attr_reader :pundit_user, :convention

  def initialize(base_scope:, convention:, pundit_user:, filters: {}, sort: nil, visible_field_ids: nil)
    super(base_scope, filters, sort, visible_field_ids)
    @convention = convention
    @pundit_user = pundit_user
  end

  def fields
    []
  end

  private

  def apply_filter(scope, filter, value)
    case filter
    when :category
      value.present? ? scope.where(event_category_id: value) : scope
    when :title
      Names.string_search(scope, value, ['title'])
    when :title_prefix
      value.present? ? scope.title_prefix(value) : scope
    when :my_rating
      value.present? ? scope.with_rating_for_user_con_profile(user_con_profile, value) : scope
    else
      scope
    end
  end

  def expand_scope_for_sort(scope, sort_field, direction)
    case sort_field
    when :first_scheduled_run_start
      Pundit.authorize(pundit_user, convention, :schedule?)
      scope.joins(<<~SQL)
        LEFT JOIN runs ON (
          runs.event_id = events.id AND
          runs.starts_at = (
            SELECT MIN(runs.starts_at) FROM runs WHERE runs.event_id = events.id
          )
        )
      SQL
    when :title
      scope.order_by_title(direction)
    when :my_rating
      if user_con_profile && !pundit_user.assumed_identity_from_profile
        scope.order_by_rating_for_user_con_profile(user_con_profile, direction)
      else
        scope
      end
    when :owner
      scope.joins(:owner)
    else
      scope
    end
  end

  def sql_order_for_sort_field(sort_field, direction)
    case sort_field
    when :first_scheduled_run_start
      "runs.starts_at #{direction}"
    when :title, :my_rating
      nil # we handle these in expand_scope_for_sort
    when :owner
      "user_con_profiles.last_name #{direction}, user_con_profiles.first_name #{direction}"
    else
      super
    end
  end

  def user_con_profile
    return nil unless pundit_user&.user

    @user_con_profile ||= begin
      convention.user_con_profiles.find_by(user_id: pundit_user.user.id)
    end
  end
end
