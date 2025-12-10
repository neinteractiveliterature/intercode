class CascadeDeleteFromOpenidRequests < ActiveRecord::Migration[8.1]
  def change
    remove_foreign_key :oauth_openid_requests, column: :access_grant_id, to_table: :oauth_access_grants
    add_foreign_key :oauth_openid_requests, :oauth_access_grants, column: :access_grant_id, on_delete: :cascade
  end
end
