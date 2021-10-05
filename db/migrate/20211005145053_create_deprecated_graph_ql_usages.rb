# frozen_string_literal: true
class CreateDeprecatedGraphQlUsages < ActiveRecord::Migration[6.1]
  def change
    create_table :deprecated_graph_ql_usages do |t|
      t.text :operation_name
      t.text :graphql_type
      t.text :field_name
      t.text :argument_name
      t.text :user_agent
      t.inet :client_address

      t.timestamps
    end
  end
end
