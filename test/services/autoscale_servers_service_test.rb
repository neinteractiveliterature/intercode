# frozen_string_literal: true
require "test_helper"

class AutoscaleServersServiceTest < ActiveSupport::TestCase
  Service = AutoscaleServersService

  # Local to each test, so they don't depend on the environment's AUTOSCALE_* settings
  let(:min_instances) { Service::MIN_INSTANCES }
  let(:max_instances) { Service::MAX_INSTANCES }
  let(:signup_minimum) { Service::MIN_INSTANCES_FOR_SIGNUP_OPENING }
  let(:now) { Time.zone.local(2026, 6, 1, 12, 0, 0) }

  def convention_with_attendees(count, **attributes)
    convention = create(:convention, **attributes)
    create_list(:user_con_profile, count, convention:)
    convention
  end

  def open_signups(convention, at:, maximum_event_signups: "unlimited")
    create(:signup_round, convention:, start: at, maximum_event_signups:)
  end

  describe ".scaling_target_for_signup_opening" do
    it "is just the minimum for a convention with no attendees" do
      assert_equal signup_minimum, Service.scaling_target_for_signup_opening(create(:convention))
    end

    it "grows with the number of attendees, never less than the minimum for a signup opening" do
      small = Service.scaling_target_for_signup_opening(convention_with_attendees(4))
      large = Service.scaling_target_for_signup_opening(convention_with_attendees(200))

      assert_operator small, :>=, signup_minimum
      assert_operator large, :>, small
    end

    it "follows the formula of a log2 term, a linear term and a minimum" do
      convention = convention_with_attendees(16)

      expected = (0.5 * Math.log2(16)) + (0.5 * (1 / Service::USERS_PER_INSTANCE.to_f) * 16) + signup_minimum

      assert_in_delta expected, Service.scaling_target_for_signup_opening(convention), 0.0001
    end

    it "counts only attendees with tickets when a ticket is required for signups" do
      convention = convention_with_attendees(8, ticket_mode: "required_for_signup")
      ticket_type = create(:free_ticket_type, convention:)
      convention.user_con_profiles.first(2).each { |profile| create(:ticket, user_con_profile: profile, ticket_type:) }

      expected = (0.5 * Math.log2(2)) + (0.5 * (1 / Service::USERS_PER_INSTANCE.to_f) * 2) + signup_minimum

      assert_in_delta expected, Service.scaling_target_for_signup_opening(convention), 0.0001
    end
  end

  describe ".smooth_decay" do
    it "starts at the start value and ends at the finish value" do
      assert_in_delta 10.0, Service.smooth_decay(0, 10, 2), 0.0001
      assert_in_delta 2.0, Service.smooth_decay(1, 10, 2), 0.0001
    end

    it "is halfway at the halfway point, and falls monotonically" do
      assert_in_delta 6.0, Service.smooth_decay(0.5, 10, 2), 0.0001
      values = [0, 0.25, 0.5, 0.75, 1].map { |amount| Service.smooth_decay(amount, 10, 2) }
      assert_equal values.sort.reverse, values
    end
  end

  describe ".apply_throttle_for_target" do
    let(:start_time) { now }
    let(:target) { 8.0 }

    def throttle(time)
      Service.apply_throttle_for_target(target, start_time, time)
    end

    it "uses the minimum well before the signup opening" do
      assert_equal signup_minimum, throttle(start_time - 10.hours)
    end

    it "goes to the full target in the hour before the opening, and at the moment of it" do
      assert_equal target, throttle(start_time - Service::SIGNUP_OPENING_FULL_THROTTLE_LOOKAHEAD_TIME)
      assert_equal target, throttle(start_time - 10.minutes)
      assert_equal target, throttle(start_time)
    end

    it "ramps up gradually in between" do
      lookahead = Service::SIGNUP_OPENING_RAMP_UP_LOOKAHEAD_TIME
      full = Service::SIGNUP_OPENING_FULL_THROTTLE_LOOKAHEAD_TIME
      midway = throttle(start_time - ((lookahead + full) / 2.0))

      assert_operator midway, :>, signup_minimum
      assert_operator midway, :<, target
    end

    it "decays back to the minimum after the opening" do
      decay = Service::SIGNUP_OPENING_DECAY_TIME
      early = throttle(start_time + 1.minute)
      late = throttle(start_time + (decay * 0.9))

      assert_operator early, :>, late
      assert_operator late, :>, signup_minimum
      assert_equal signup_minimum, throttle(start_time + decay)
      assert_equal signup_minimum, throttle(start_time + decay + 1.hour)
    end
  end

  describe ".scaling_target_for" do
    it "is the minimum when no signup rounds are nearby" do
      create(:convention)

      assert_equal min_instances, Service.scaling_target_for(now)
    end

    it "scales up for a convention with a signup round about to open" do
      convention = convention_with_attendees(300)
      open_signups(convention, at: now + 30.minutes)

      target = Service.scaling_target_for(now)

      assert_operator target, :>, min_instances
      assert_operator target, :<=, max_instances
      assert_kind_of Integer, target
    end

    it "rounds up to a whole number of instances" do
      convention = convention_with_attendees(300)
      open_signups(convention, at: now + 30.minutes)
      exact = Service.scaling_target_for_signup_opening(convention)

      assert_equal [exact.ceil, max_instances].min, Service.scaling_target_for(now)
    end

    it "never goes above the maximum" do
      convention = convention_with_attendees(5000)
      open_signups(convention, at: now + 30.minutes)

      assert_equal max_instances, Service.scaling_target_for(now)
    end

    it "uses the busiest of several conventions" do
      small = convention_with_attendees(5)
      large = convention_with_attendees(300)
      open_signups(small, at: now + 30.minutes)
      open_signups(large, at: now + 30.minutes)

      alone = Service.scaling_target_for_signup_opening(large).ceil.clamp(min_instances, max_instances)

      assert_equal alone, Service.scaling_target_for(now)
    end

    it "ignores signup rounds that open further ahead than the lookahead" do
      convention = convention_with_attendees(300)
      open_signups(convention, at: now + Service::SIGNUP_OPENING_LOOKAHEAD_TIME + 1.hour)

      assert_equal min_instances, Service.scaling_target_for(now)
    end

    it "ignores signup rounds that opened further back than the lookback" do
      convention = convention_with_attendees(300)
      open_signups(convention, at: now - Service::SIGNUP_OPENING_LOOKBACK_TIME - 1.hour)

      assert_equal min_instances, Service.scaling_target_for(now)
    end

    it "ignores rounds that do not let anyone sign up" do
      convention = convention_with_attendees(300)
      open_signups(convention, at: now + 30.minutes, maximum_event_signups: "not_now")
      other = convention_with_attendees(300)
      open_signups(other, at: now + 30.minutes, maximum_event_signups: "not_yet")

      assert_equal min_instances, Service.scaling_target_for(now)
    end

    it "ignores conventions where signups need to be moderated" do
      convention = convention_with_attendees(300, signup_mode: "moderated")
      open_signups(convention, at: now + 30.minutes)

      assert_equal min_instances, Service.scaling_target_for(now)
    end

    it "copes with a convention that has no attendees yet" do
      convention = create(:convention)
      open_signups(convention, at: now - 1.hour)

      target = Service.scaling_target_for(now)

      assert_operator target, :>=, min_instances
    end
  end

  describe "worker sizing" do
    it "uses one small worker when the web servers are at the minimum" do
      Service.stub(:scaling_target_for, min_instances) do
        assert_equal 1, Service.worker_scaling_target_for(now)
        assert_equal :small, Service.worker_instance_type_for(now)
      end
    end

    it "uses two large workers when the web servers are scaled up" do
      Service.stub(:scaling_target_for, min_instances + 1) do
        assert_equal 2, Service.worker_scaling_target_for(now)
        assert_equal :large, Service.worker_instance_type_for(now)
      end
    end
  end

  describe "#call" do
    let(:adapter) { Minitest::Mock.new }

    def run_service_with(web_target, worker_target, worker_type)
      Service.stub(:scaling_target_for, web_target) do
        Service.stub(:worker_scaling_target_for, worker_target) do
          Service.stub(:worker_instance_type_for, worker_type) do
            HostingServiceAdapters.stub(:find_adapter, adapter) { Service.new.call }
          end
        end
      end
    end

    it "asks the hosting adapter for small web servers and one small worker at the minimum" do
      adapter.expect(
        :apply_instance_counts,
        nil,
        [[{ group: :web, type: :small, count: min_instances }, { group: :worker, type: :small, count: 1 }]]
      )

      result = run_service_with(min_instances, 1, :small)

      assert result.success?
      adapter.verify
    end

    it "asks for medium web servers and two large workers when scaled up" do
      adapter.expect(
        :apply_instance_counts,
        nil,
        [[{ group: :web, type: :medium, count: min_instances + 3 }, { group: :worker, type: :large, count: 2 }]]
      )

      result = run_service_with(min_instances + 3, 2, :large)

      assert result.success?
      adapter.verify
    end
  end
end
