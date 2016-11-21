require 'test_helper'

class EventSignupServiceTest < ActiveSupport::TestCase
  include ActiveJob::TestHelper

  let(:event) { FactoryGirl.create :event }
  let(:the_run) { FactoryGirl.create :run, event: event }
  let(:convention) { event.convention }
  let(:user_con_profile) { FactoryGirl.create :user_con_profile, convention: convention }
  let(:requested_bucket_key) { :unlimited }

  subject { EventSignupService.new(user_con_profile, the_run, requested_bucket_key) }

  it 'signs the user up for an event' do
    result = subject.call
    result.must_be :success?
    result.signup.must_be :confirmed?
  end

  it 'emails the team members who have requested it' do
    email_team_member = FactoryGirl.create(:team_member, event: event, receive_signup_email: true)
    email_team_member2 = FactoryGirl.create(:team_member, event: event, receive_signup_email: true)
    no_email_team_member = FactoryGirl.create(:team_member, event: event, receive_signup_email: false)

    perform_enqueued_jobs do
      result = subject.call
      result.must_be :success?

      ActionMailer::Base.deliveries.size.must_equal 2
      recipients = ActionMailer::Base.deliveries.map(&:to)
      recipients.must_include [email_team_member.user_con_profile.email]
      recipients.must_include [email_team_member2.user_con_profile.email]
      recipients.wont_include [no_email_team_member.user_con_profile.email]
    end
  end

  describe 'with limited buckets' do
    let(:event) do
      FactoryGirl.create(
        :event,
        registration_policy: {
          buckets: [
            { key: 'dogs', slots_limited: true, total_slots: 3 },
            { key: 'cats', slots_limited: true, total_slots: 2 },
            { key: 'anything', slots_limited: true, total_slots: 4, anything: true }
          ]
        }
      )
    end

    let(:requested_bucket_key) { :cats }

    it 'will sign the user up into that bucket' do
      result = subject.call
      result.must_be :success?
      result.signup.must_be :confirmed?
      result.signup.bucket_key.must_equal 'cats'
      result.signup.requested_bucket_key.must_equal 'cats'
    end

    it 'will fall back to the anything bucket if necessary' do
      2.times { create_other_signup 'cats' }

      result = subject.call
      result.must_be :success?
      result.signup.must_be :confirmed?
      result.signup.bucket_key.must_equal 'anything'
      result.signup.requested_bucket_key.must_equal 'cats'
    end

    it 'will go to the waitlist if necessary' do
      2.times { create_other_signup 'cats' }
      4.times { create_other_signup 'anything' }

      result = subject.call
      result.must_be :success?
      result.signup.must_be :waitlisted?
      result.signup.bucket_key.must_be :nil?
      result.signup.requested_bucket_key.must_equal 'cats'
    end
  end

  private

  def create_other_signup(bucket_key)
    signup_user_con_profile = FactoryGirl.create(:user_con_profile, convention: convention)
    FactoryGirl.create(
      :signup,
      user_con_profile: signup_user_con_profile,
      run: the_run,
      bucket_key: bucket_key,
      requested_bucket_key: bucket_key
    )
  end
end