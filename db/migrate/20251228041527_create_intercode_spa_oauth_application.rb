class CreateIntercodeSpaOAuthApplication < ActiveRecord::Migration[8.1]
  def change
    add_column :oauth_applications, :is_intercode_frontend, :boolean, default: false, null: false
    add_index :oauth_applications, :is_intercode_frontend, unique: true, where: 'is_intercode_frontend'

    reversible do |dir|
      dir.up do
        # Only create if it doesn't exist
        unless Doorkeeper::Application.exists?(is_intercode_frontend: true)
          app =
            Doorkeeper::Application.create!(
              name: "Intercode Frontend",
              is_intercode_frontend: true,
              redirect_uri: "http://localhost:3135/oauth/callback\nhttps://intercode.test:3135/oauth/callback",
              scopes: Doorkeeper.configuration.scopes.map(&:to_s).join(' '),
              confidential: false
            )

          say "Created OAuth Application: #{app.name} (UID: #{app.uid})"
        end
      end

      dir.down do |dir|
        Doorkeeper::Application.where(is_intercode_frontend: true).delete_all
      end
    end
  end
end
