class ConstrainSignupRoundMaximumEventSignupsValues < ActiveRecord::Migration[7.1]
  def change
    reversible do |dir|
      dir.up do
        execute(
          "UPDATE signup_rounds SET maximum_event_signups = 'not_now' WHERE maximum_event_signups = 'not_anymore';"
        )
      end
    end

    add_check_constraint :signup_rounds, <<~SQL
      maximum_event_signups IN ('not_yet', 'not_now', 'unlimited') OR maximum_event_signups::integer >= 1
    SQL
  end
end
