# frozen_string_literal: true
require "test_helper"

describe Types::EventType do
  let(:convention) { create(:convention) }
  let(:user_con_profile) { create(:user_con_profile, convention:) }
  let(:event_category) { create(:event_category, convention:) }

  before do
    section = event_category.event_form.form_sections.create!(title: "Section")
    section.form_items.create!(
      item_type: "free_text",
      identifier: "description",
      properties: {
        "lines" => 5,
        "caption" => "Description",
        "format" => "markdown"
      }
    )
  end

  it "does not issue an image attachment query per event" do
    Array.new(5) { create(:event, convention:, event_category:, description: "some *markdown*") }

    query = <<~GRAPHQL
      query {
        conventionByRequestHost {
          events {
            id
            form_response_attrs_json_with_rendered_markdown
          }
        }
      }
    GRAPHQL

    queries = count_queries(/SELECT "active_storage_attachments"/) { execute_graphql_query(query, user_con_profile:) }
    assert_operator queries, :<=, 1, "expected a constant number of image attachment queries regardless of event count"
  end
end
