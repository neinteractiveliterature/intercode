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

  field :category, 'Category' do
    column_filter :event_category_id
  end

  field :title, 'Title' do
    def apply_filter(scope, value)
      Names.string_search(scope, value, ['title'])
    end

    # Weird hax: we're handling the actual sorting in expand_scope_for_sort
    def expand_scope_for_sort(scope, direction)
      scope.order_by_title(direction)
    end

    def sql_order(_direction)
      nil
    end
  end

  field :title_prefix, 'Title prefix' do
    def apply_filter(scope, value)
      value.present? ? scope.title_prefix(value) : scope
    end
  end

  field :my_rating, 'My rating' do
    delegate :user_con_profile, :pundit_user, to: :presenter

    def apply_filter(scope, value)
      return scope unless value.present?
      scope.with_rating_for_user_con_profile(user_con_profile, value)
    end

    # Weird hax: we're handling the actual sorting in expand_scope_for_sort
    def expand_scope_for_sort(scope, direction)
      if user_con_profile && !pundit_user.assumed_identity_from_profile
        scope.order_by_rating_for_user_con_profile(user_con_profile, direction)
      else
        scope
      end
    end

    def sql_order(_direction)
      nil
    end
  end

  field :first_scheduled_run_start, 'First scheduled run' do
    delegate :pundit_user, :convention, to: :presenter

    def expand_scope_for_sort(scope, _direction)
      Pundit.authorize(pundit_user, convention, :schedule?)
      scope.joins(<<~SQL)
        LEFT JOIN runs ON (
          runs.event_id = events.id AND
          runs.starts_at = (
            SELECT MIN(runs.starts_at) FROM runs WHERE runs.event_id = events.id
          )
        )
      SQL
    end

    def sql_order(direction)
      "runs.starts_at #{direction}"
    end
  end

  field :owner, 'Owner' do
    def expand_scope_for_sort(scope, _direction)
      scope.joins(:owner)
    end

    def sql_order(direction)
      "user_con_profiles.last_name #{direction}, user_con_profiles.first_name #{direction}"
    end
  end

  field :created_at, 'Created at'

  attr_reader :pundit_user, :convention

  def initialize(
    base_scope:, convention:, pundit_user:, filters: {}, sort: nil, visible_field_ids: nil
  )
    super(base_scope, filters, sort, visible_field_ids)
    @convention = convention
    @pundit_user = pundit_user
  end

  def user_con_profile
    return nil unless pundit_user&.user

    @user_con_profile ||= begin
      convention.user_con_profiles.find_by(user_id: pundit_user.user.id)
    end
  end
end
