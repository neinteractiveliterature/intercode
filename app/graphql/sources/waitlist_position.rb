# frozen_string_literal: true
class Sources::WaitlistPosition < GraphQL::Dataloader::Source
  # keys are signups
  def fetch(keys)
    run_ids = keys.map(&:run_id).uniq
    signup_ids_ordered = load_signup_ids_ordered(run_ids)

    keys.map do |signup|
      waitlist_index = signup_ids_ordered[signup.run_id].index(signup.id)
      waitlist_index.nil? ? nil : waitlist_index + 1
    end
  end

  private

  def load_signup_ids_ordered(run_ids)
    Signup
      .where(state: "waitlisted", run_id: run_ids)
      .pluck(:run_id, :id, :created_at)
      .group_by(&:first)
      .transform_values { |rows| rows.sort_by(&:third).map(&:second) }
  end
end
