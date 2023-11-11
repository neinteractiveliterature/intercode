# frozen_string_literal: true
class SignupCountPresenter
  include SortBuckets
  include ActionView::Helpers::TextHelper

  DIMENSIONS = %i[state bucket_key requested_bucket_key counted team_member]

  class SignupCountRow
    attr_reader :count, :state, :bucket_key, :requested_bucket_key, :counted, :team_member

    def self.from_data(count, data)
      state, bucket_key, requested_bucket_key, counted, team_member = data

      new(
        count: count,
        state: state,
        bucket_key: bucket_key,
        requested_bucket_key: requested_bucket_key,
        counted: counted || false,
        team_member: team_member || false
      )
    end

    def initialize(count:, state:, bucket_key:, requested_bucket_key:, counted:, team_member:)
      @count = count
      @state = state
      @bucket_key = bucket_key
      @requested_bucket_key = requested_bucket_key
      @counted = counted
      @team_member = team_member
    end

    def attributes
      {
        count: count,
        state: state,
        bucket_key: bucket_key,
        requested_bucket_key: requested_bucket_key,
        counted: counted,
        team_member: team_member
      }
    end
  end

  class SignupCountData
    attr_reader :dimension

    def initialize(dimension, rows)
      @dimension = dimension
      @rows_by_dimension =
        rows
          .group_by { |row| row.public_send(dimension) }
          .transform_values do |rows_subset|
            final? ? rows_subset.sum(&:count) : SignupCountData.new(next_dimension, rows_subset)
          end
      @final = nil
    end

    def next_dimension
      @next_dimension ||= DIMENSIONS[DIMENSIONS.index(dimension) + 1]
    end

    def final?
      return @final unless @final.nil?
      @final = dimension == DIMENSIONS[DIMENSIONS.size - 1]
    end

    def count(**filters)
      filtered_data =
        (filters.key?(dimension) ? [@rows_by_dimension[filters.fetch(dimension)]] : @rows_by_dimension.values)
      final? ? filtered_data.sum : filtered_data.sum { |data| data&.count(**filters) || 0 }
    end

    def grouped_data
      if final?
        @rows_by_dimension.map { |key, value| { dimension => key, :count => value } }
      else
        @rows_by_dimension.flat_map { |key, value| value.grouped_data.map { |row| { dimension => key, **row } } }
      end
    end
  end

  attr_reader :run

  def self.effective_bucket_key(state, bucket_key, requested_bucket_key)
    return requested_bucket_key if state == "waitlisted"
    bucket_key
  end

  def self.group_count_signups(scope)
    scope
      .joins(run: :event)
      .joins(
        "LEFT JOIN team_members ON team_members.event_id = events.id \
AND team_members.user_con_profile_id = signups.user_con_profile_id"
      )
      .group(:run_id, :state, :bucket_key, :requested_bucket_key, :counted, "team_members.id IS NOT NULL")
      .count
  end

  def self.signup_count_data_for_runs(runs)
    data_with_run_ids = group_count_signups(Signup.where(run_id: runs.map(&:id)))

    data_with_run_ids
      .to_a
      .group_by { |(key, _)| key.first }
      .transform_values do |run_data|
        rows = run_data.map { |(_run_id, *data), count| SignupCountRow.from_data(count, data) }
        SignupCountData.new(DIMENSIONS[0], rows)
      end
  end

  def self.for_runs(runs)
    data_by_run_id = signup_count_data_for_runs(runs)
    runs.each_with_object({}) do |run, hash|
      hash[run.id] = new(run, count_data: data_by_run_id[run.id] || SignupCountData.new(DIMENSIONS[0], []))
    end
  end

  def initialize(run, count_data: nil)
    @run = run
    @count_data = count_data
  end

  def count_data
    @count_data ||=
      begin
        data_with_run_ids = SignupCountPresenter.group_count_signups(Signup.where(run_id: run.id))
        rows = data_with_run_ids.to_a.map { |(_run_id, *data), count| SignupCountRow.from_data(count, data) }
        SignupCountData.new(DIMENSIONS[0], rows)
      end
  end

  def signups_description
    [
      "Signed up: #{bucket_descriptions_text("confirmed")}",
      (has_waitlist? ? "Waitlisted: #{bucket_descriptions_text("waitlisted")}" : nil)
    ].compact.join("\n")
  end

  def bucket_descriptions_text(state)
    bucket_descriptions(state).map(&:strip).join(", ")
  end

  def bucket_descriptions(state)
    counted_key = counted_key_for_state(state)

    if buckets.size == 1
      [count_data.count(bucket_key: buckets.first.key, counted: counted_key).to_s]
    else
      bucket_texts =
        buckets.map do |bucket|
          bucket_counted_key = counted_key
          bucket_counted_key = :not_counted if bucket.not_counted?
          "#{bucket.name}: #{count_data.count(bucket_key: bucket.key, counted: bucket_counted_key)}"
        end

      no_pref_count = count_data.count(requested_bucket_key: nil, counted: false)
      bucket_texts << "No preference: #{no_pref_count}" if state == "waitlisted" && no_pref_count.positive?

      bucket_texts
    end
  end

  def counted_key_for_state(state)
    return false if state != "confirmed" || registration_policy.only_uncounted?
    true
  end

  def confirmed_count
    @confirmed_count ||= count_data.count(state: "confirmed")
  end

  def confirmed_limited_count
    @confirmed_limited_count ||=
      buckets
        .select(&:slots_limited?)
        .sum { |bucket| count_data.count(state: "confirmed", bucket_key: bucket.key, counted: true) }
  end

  # Waitlisted signups are never counted, so count them all here
  def waitlist_count
    @waitlist_count ||= count_data.count(state: "waitlisted")
  end

  def capacity_fraction_for_bucket(bucket_key)
    bucket = registration_policy.bucket_with_key(bucket_key)
    return 1.0 if bucket.slots_unlimited?
    return 0.0 if bucket.total_slots.zero?

    remaining_slots = (bucket.total_slots - count_data.count(state: "confirmed", bucket_key: bucket_key))
    remaining_slots.to_f / bucket.total_slots
  end

  def has_waitlist?
    waitlist_count.positive?
  end

  def signup_count(**filters)
    count_data.count(**filters)
  end

  def grouped_signup_counts
    @grouped_signup_counts ||= count_data.grouped_data
  end

  def buckets
    @buckets ||= sort_buckets(registration_policy.buckets)
  end

  private

  def registration_policy
    @registration_policy ||= run.registration_policy
  end
end
