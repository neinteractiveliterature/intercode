# frozen_string_literal: true
class Tables::RunsTableResultsPresenter < Tables::TableResultsPresenter
  def self.for_convention(convention:, pundit_user:, filters: {}, sort: nil, visible_field_ids: nil)
    scope =
      Pundit.policy_scope(
        pundit_user,
        convention.runs.joins(:event).where(events: { status: "active" }).includes(event: %i[convention event_category])
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

  field :category, "Category" do
    def apply_filter(scope, value)
      scope.where(events: { event_category_id: value })
    end

    def generate_csv_cell(run)
      run.event.event_category.name
    end
  end

  field :title, "Title" do
    def apply_filter(scope, value)
      scope.where(event_id: Names.string_search(Event.all, value, ["title"]).select(:id))
    end

    # Weird hax: we're handling the actual sorting in expand_scope_for_sort
    def expand_scope_for_sort(scope, direction)
      scope.order(Arel.sql(Event.order_by_title(direction).arel.ast.orders))
    end

    def sql_order(_direction)
      nil
    end

    def generate_csv_cell(run)
      run.event.title
    end
  end

  field :title_prefix, "Title prefix" do
    def apply_filter(scope, value)
      value.present? ? scope.where(event_id: Event.title_prefix(value).select(:id)) : scope
    end
  end

  field :my_rating, "My rating" do
    delegate :user_con_profile, :pundit_user, to: :presenter

    def apply_filter(scope, value)
      return scope if value.blank?
      scope.where(event_id: Event.with_rating_for_user_con_profile(user_con_profile, value).select(:id))
    end

    # Weird hax: we're handling the actual sorting in expand_scope_for_sort
    def expand_scope_for_sort(scope, direction)
      if user_con_profile && !pundit_user.assumed_identity_from_profile
        scope.order(Arel.sql(Event.order_by_rating_for_user_con_profile(user_con_profile, direction).arel.ast.orders))
      else
        scope
      end
    end

    def sql_order(_direction)
      nil
    end
  end

  field :starts_at, "Starts at"

  field :length_seconds, "Duration" do
    def generate_csv_cell(run)
      duration_parts = ActiveSupport::Duration.build(run.event.length_seconds).parts
      format("%d:%02d", duration_parts[:hours] || 0, duration_parts[:minutes] || 0)
    end
  end

  field :event_created_at, "Event added at"

  field :form_items, "Convention-specific form items" do
    def apply_filter(scope, value)
      value
        .each
        .inject(scope) do |acc_scope, (identifier, values)|
          if values.present?
            acc_scope.where(
              %("events"."additional_info"->:field ?| array[:values]),
              field: identifier,
              values: Array(values)
            )
          else
            acc_scope
          end
        end
    end
  end

  attr_reader :pundit_user, :convention

  def initialize(base_scope:, convention:, pundit_user:, filters: {}, sort: nil, visible_field_ids: nil)
    @convention = convention
    @pundit_user = pundit_user
    super(base_scope, filters, sort, visible_field_ids)
  end

  def form_fields
    @form_fields ||=
      begin
        filterable_items_by_identifier =
          FormItem
            .joins(form_section: :form)
            .where(forms: { convention_id: convention.id, form_type: "event" })
            .where(Arel.sql("expose_in @> ARRAY['event_catalog']"))
            .group_by(&:identifier)

        filterable_items_by_identifier
          .values
          .map do |form_items|
            # TODO merge form items
            Tables::TableResultsPresenter::FormField.new(
              self,
              form_items.first,
              get_form_response_from_row: ->(run) { run.event }
            )
          end
          .index_by(&:id)
      end
  end

  def fields
    @fields ||= super.merge(form_fields)
  end

  def user_con_profile
    return nil unless pundit_user&.user

    @user_con_profile ||= convention.user_con_profiles.find_by(user_id: pundit_user.user.id)
  end
end
