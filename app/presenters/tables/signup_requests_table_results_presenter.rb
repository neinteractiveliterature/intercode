# frozen_string_literal: true
class Tables::SignupRequestsTableResultsPresenter < Tables::TableResultsPresenter
  def self.for_convention(convention:, pundit_user:, filters: {}, sort: nil, visible_field_ids: nil)
    scope = SignupRequestPolicy::Scope.new(pundit_user, convention.signup_requests).resolve
    new(
      base_scope:
        scope.includes(
          user_con_profile: %i[team_members staff_positions],
          target_run: {
            event: :convention
          },
          replace_signup: {
            run: {
              event: :convention
            }
          }
        ),
      convention: convention,
      pundit_user: pundit_user,
      filters: filters,
      sort: sort,
      visible_field_ids: visible_field_ids
    )
  end

  field :state, 'State' do
    column_filter

    def sql_order(direction)
      Arel.sql(<<~SQL.squish)
      (
        CASE
        WHEN state = 'pending' THEN 0
        WHEN state = 'accepted' THEN 1
        WHEN state = 'rejected' THEN 2
        WHEN state = 'withdrawn' THEN 3
        END
      ) #{direction}
      SQL
    end
  end

  field :created_at, 'Created at'

  attr_reader :pundit_user, :convention

  def initialize(base_scope:, convention:, pundit_user:, filters: {}, sort: nil, visible_field_ids: nil)
    super(base_scope, filters, sort, visible_field_ids)
    @convention = convention
    @pundit_user = pundit_user
  end
end
