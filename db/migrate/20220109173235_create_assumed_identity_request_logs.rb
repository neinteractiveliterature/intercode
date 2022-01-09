class CreateAssumedIdentityRequestLogs < ActiveRecord::Migration[7.0]
  def change
    create_table :assumed_identity_request_logs do |t|
      t.references :assumed_identity_session,
                   null: false,
                   foreign_key: true,
                   index: {
                     name: 'idx_assumed_identity_request_logs_on_session_id'
                   }
      t.text :controller_name, null: false
      t.text :action_name, null: false
      t.text :http_method, null: false
      t.text :url, null: false
      t.inet :ip_address, null: false
      t.jsonb :http_headers, null: false
      t.text :http_body

      t.text :graphql_operation_name
      t.text :graphql_document
      t.jsonb :graphql_variables

      t.timestamps
    end

    add_index :assumed_identity_request_logs, :created_at
  end
end
