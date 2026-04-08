# frozen_string_literal: true
class Tables::RankedChoiceDecisionsTableResultsPresenter < Tables::TableResultsPresenter
  def self.for_signup_round(signup_round:, pundit_user:, filters: {}, sort: nil, visible_field_ids: nil)
    scope = RankedChoiceDecisionPolicy::Scope.new(pundit_user, signup_round.ranked_choice_decisions).resolve
    new(scope, filters, sort, visible_field_ids)
  end

  field :user_con_profile_name, "Attendee" do
    def apply_filter(scope, value)
      scope.where(user_con_profile_id: UserConProfile.name_search(value).select(:id))
    end

    def expand_scope_for_sort(scope, _direction)
      scope.joins(:user_con_profile)
    end

    def sql_order(direction)
      Arel.sql(
        "lower(user_con_profiles.last_name) #{direction}, \
lower(user_con_profiles.first_name) #{direction}"
      )
    end

    def generate_csv_cell(decision)
      decision.user_con_profile.name_inverted
    end
  end

  field :event_title, "Event" do
    ilike_column_filter :title, association_name: :event

    def generate_csv_cell(decision)
      decision.event.title
    end
  end

  field :decision, "Decision" do
    column_filter :decision
  end

  field :reason, "Reason" do
    column_filter :reason
  end

  field :created_at, "Timestamp"
end
