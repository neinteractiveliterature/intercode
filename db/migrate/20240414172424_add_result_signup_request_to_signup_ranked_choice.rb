class AddResultSignupRequestToSignupRankedChoice < ActiveRecord::Migration[7.1]
  def change
    add_reference :signup_ranked_choices,
                  :result_signup_request,
                  null: true,
                  foreign_key: {
                    to_table: :signup_requests
                  }
  end
end
