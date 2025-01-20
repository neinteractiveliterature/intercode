class EnsureSignupRoundsOnAllConventions < ActiveRecord::Migration[8.0]
  def change
    reversible do |dir|
      dir.up do
        Convention.find_each do |convention|
          say "Adding signup round for #{convention.name}" if convention.signup_rounds.none?
          convention.ensure_signup_round_exists
        end
      end
    end
  end
end
