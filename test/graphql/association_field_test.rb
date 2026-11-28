# frozen_string_literal: true
require "test_helper"

class AssociationFieldTest < ActiveSupport::TestCase
  include ExecutionEngineComparisonHelper

  def self.association_fields
    Rails.application.eager_load!
    IntercodeSchema.types.values.flat_map do |type|
      next [] unless type.kind.object?

      type.own_fields.values.flatten.filter_map do |field|
        key = field.execution_mode_key
        unless field.execution_mode == :dataload && key.is_a?(Hash) && key[:with] == Sources::ActiveRecordAssociation
          next
        end

        [type, field, *key[:by]]
      end
    end
  end

  # A hand-written method with the same name would be used by the original engine and silently skipped by execute_next
  it "names an association that exists on the model, and isn't overridden by a resolver method" do
    association_fields.each do |type, field, model, association|
      name = "#{type.graphql_name}.#{field.graphql_name}"

      assert model.reflect_on_association(association), "#{name}: #{model} has no #{association} association"
      source_file = type.instance_method(field.resolver_method).source_location.first
      assert source_file.end_with?("types/base_object.rb"), "#{name} is overridden in #{source_file}"
    end
  end

  it "loads Event's associations the same way on both engines, in batches" do
    convention = create(:convention)
    admin = create(:user_con_profile, convention:, user: create(:site_admin))
    events = create_list(:event, 3, convention:)

    data =
      assert_engines_agree(
        [Types::EventType],
        "convention { id } event_category { id } ticket_types { id } registration_policy { __typename }",
        -> { Event.where(id: events.map(&:id)).order(:id).to_a },
        -> { ActiveSupport::TestCase::TestGraphqlContext.with_user_con_profile(UserConProfile.find(admin.id)) }
      )

    assert_equal 3, data.size
    assert(data.all? { |event| event.dig("convention", "id") == convention.id.to_s })
  end

  private

  def association_fields
    self.class.association_fields
  end
end
