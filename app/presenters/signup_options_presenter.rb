class SignupOptionsPresenter
  class BucketSignupOption
    attr_reader :bucket, :index, :hide_label

    def initialize(bucket, index, hide_label)
      @bucket = bucket
      @index = index
      @hide_label = hide_label
    end

    def label
      return nil if hide_label
      bucket.name
    end

    def params
      { requested_bucket_key: bucket.key }
    end

    def button_class
      "btn-outline-bucket-color-#{(index % 9) + 1}"
    end

    def no_preference?
      false
    end

    def team_member?
      false
    end
  end

  class NoPreferenceSignupOption
    def label
      'No preference'
    end

    def params
      { no_requested_bucket: true }
    end

    def button_class
      'btn-outline-dark'
    end

    def bucket
      nil
    end

    def no_preference?
      true
    end

    def team_member?
      false
    end
  end

  class TeamMemberSignupOption
    attr_reader :team_member_name

    def initialize(team_member_name)
      @team_member_name = team_member_name
    end

    def label
      team_member_name
    end

    def params
      { no_requested_bucket: true }
    end

    def button_class
      'btn-outline-primary'
    end

    def bucket
      nil
    end

    def no_preference?
      false
    end

    def team_member?
      true
    end
  end

  class SignupOption
    attr_reader :label, :params, :button_class, :bucket

    def initialize(label: nil, params: nil, button_class: nil, bucket: nil)
      @label = label
      @params = params
      @button_class = button_class
      @bucket = bucket
    end
  end

  include Concerns::SortBuckets

  attr_reader :event, :user_con_profile

  def initialize(event:, user_con_profile:)
    @event = event
    @user_con_profile = user_con_profile
  end

  def buckets
    @buckets ||= sort_buckets(event.registration_policy.buckets)
  end

  def user_signup_for_run(run)
    user_signup_by_run_id[run.id]
  end

  def signup_options_for_run(run)
    return unless user_con_profile
    return if user_signup_by_run_id[run.id]

    partitioned_options_for_event.first
  end

  def auxiliary_signup_options_for_run(run)
    return unless user_con_profile
    return if user_signup_by_run_id[run.id]

    partitioned_options_for_event.second
  end

  def no_preference_options
    @no_preference_options ||= begin
      if !event.registration_policy.allow_no_preference_signups?
        []
      elsif buckets.reject(&:slots_unlimited?).size <= 1
        []
      else
        [NoPreferenceSignupOption.new]
      end
    end
  end

  private

  def partitioned_options_for_event
    @partitioned_options_for_event ||= signup_options_for_event.partition do |option|
      main_option?(option)
    end
  end

  def main_option?(option)
    return false if option.bucket&.anything?
    return true if no_preference_options.none?

    option.no_preference? || option.bucket&.slots_limited?
  end

  def signup_options_for_event
    @signup_options_for_event ||= if team_member?
      [TeamMemberSignupOption.new(event.team_member_name)]
    else
      non_anything_buckets_count = buckets.reject(&:anything?).size
      buckets.each_with_index.map do |bucket, index|
        next if bucket.anything?
        BucketSignupOption.new(bucket, index, non_anything_buckets_count <= 1)
      end.compact + no_preference_options
    end
  end

  def team_member?
    return @team_member unless @team_member.nil?
    @team_member = event.team_members.any? do |team_member|
      team_member.user_con_profile == user_con_profile
    end
  end

  def user_signup_by_run_id
    @user_signup_by_run_id ||= if user_con_profile
      Signup.where(
        user_con_profile_id: user_con_profile.id,
        run_id: Run.where(event_id: event.id).select(:id),
        state: %w[confirmed waitlisted]
      ).to_a.index_by(&:run_id)
    else
      {}
    end
  end
end
