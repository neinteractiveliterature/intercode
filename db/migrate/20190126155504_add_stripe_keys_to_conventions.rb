class AddStripeKeysToConventions < ActiveRecord::Migration[5.2]
  def change
    add_column :conventions, :stripe_publishable_key, :text
    add_column :conventions, :stripe_secret_key, :text

    reversible do |dir|
      dir.up do
        if Rails.configuration.respond_to?(:stripe) && Rails.configuration.stripe
          quoted_publishable_key = ActiveRecord::Base.connection.quote(Rails.configuration.stripe[:publishable_key])
          quoted_secret_key = ActiveRecord::Base.connection.quote(Rails.configuration.stripe[:secret_key])
          execute <<~SQL
          UPDATE conventions
          SET
            stripe_publishable_key = #{quoted_publishable_key},
            stripe_secret_key = #{quoted_secret_key};
          SQL
        end
      end
    end
  end
end
