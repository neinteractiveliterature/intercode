class AllowNullRedirectUriOnOAuthAppliations < ActiveRecord::Migration[8.1]
  def change
    change_column_null :oauth_applications, :redirect_uri, true

    reversible do |dir|
      dir.up { Doorkeeper::Application.where(is_intercode_frontend: true).update_all(redirect_uri: nil) }

      dir.down do
        Doorkeeper::Application.where(is_intercode_frontend: true).update_all(
          redirect_uri: "http://localhost:3135/oauth/callback\nhttps://intercode.test:3135/oauth/callback"
        )
      end
    end
  end
end
