class WaitlistPositionLoader < GraphQL::Batch::Loader
  # keys are signups
  def perform(keys)
    run_ids = keys.map(&:run_id).uniq
    signup_ids_ordered = Signup.where(state: 'waitlisted', run_id: run_ids)
      .pluck(:run_id, :id, :created_at)
      .group_by(&:first)
      .transform_values { |rows| rows.sort_by(&:third).map(&:second) }

    keys.each do |signup|
      fulfill(signup, signup_ids_ordered[signup.run_id].index(signup.id) + 1)
    end
  end
end
