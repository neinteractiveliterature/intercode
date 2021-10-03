# frozen_string_literal: true
class WaitlistPositionLoader < GraphQL::Batch::Loader
  # keys are signups
  def perform(keys)
    run_ids = keys.map(&:run_id).uniq
    signup_ids_ordered = load_signup_ids_ordered(run_ids)

    keys.each do |signup|
      waitlist_index = signup_ids_ordered[signup.run_id].index(signup.id)
      waitlist_index.nil? ? fulfill(signup, nil) : fulfill(signup, waitlist_index + 1)
    end
  end

  private

  def load_signup_ids_ordered(run_ids)
    Signup
      .where(state: 'waitlisted', run_id: run_ids)
      .pluck(:run_id, :id, :created_at)
      .group_by(&:first)
      .transform_values { |rows| rows.sort_by(&:third).map(&:second) }
  end
end
