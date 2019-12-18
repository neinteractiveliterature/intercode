require 'test_helper'

class CreateTeamMemberServiceTest < ActiveSupport::TestCase
  let(:convention) { create :convention, :with_notification_templates }
  let(:event_category) { create(:event_category, convention: convention, can_provide_tickets: true) }
  let(:event) { create :event, convention: convention, event_category: event_category }
  let(:the_run) { create :run, event: event }
  let(:user_con_profile) { create :user_con_profile, convention: convention }
  let(:user) { user_con_profile.user }
  let(:team_member_attrs) { {} }
  let(:provide_ticket_type_id) { nil }

  subject do
    CreateTeamMemberService.new(
      event: event,
      user_con_profile: user_con_profile,
      team_member_attrs: team_member_attrs,
      provide_ticket_type_id: provide_ticket_type_id
    )
  end

  it 'creates a team_member record' do
    assert_difference(-> { event.team_members.count }, 1) do
      result = subject.call!
      assert_equal user_con_profile, result.team_member.user_con_profile
      assert_equal event, result.team_member.event
    end
  end

  describe 'providing tickets' do
    let(:ticket_type) { create(:event_provided_ticket_type, convention: convention) }
    let(:provide_ticket_type_id) { ticket_type.id }

    it 'provides a ticket if requested' do
      assert_difference(-> { Ticket.count }, 1) do
        result = subject.call!
        assert_equal user_con_profile, result.ticket.user_con_profile
        assert_equal ticket_type, result.ticket.ticket_type
        assert_equal event, result.ticket.provided_by_event
      end
    end
  end

  describe 'with existing signup' do
    let(:signup) do
      create(
        :signup,
        run: the_run, user_con_profile: user_con_profile,
        state: 'confirmed', bucket_key: 'unlimited', counted: true
      )
    end

    before { signup }

    it 'converts it to a GM signup' do
      result = subject.call!
      signup.reload

      assert_equal [signup], result.converted_signups
      refute signup.counted?
      assert_nil signup.bucket_key
      assert_equal 'confirmed', signup.state
    end

    describe 'limited buckets' do
      let(:event) do
        create(
          :event, convention: convention, event_category: event_category,
                  registration_policy: {
                    buckets: [
                      { key: 'dogs', name: 'dogs', slots_limited: true, total_slots: 3 },
                      { key: 'cats', name: 'cats', slots_limited: true, total_slots: 2 }
                    ]
                  }
        )
      end

      describe 'waitlisted' do
        let(:signup) do
          create(
            :signup,
            run: the_run, user_con_profile: user_con_profile,
            state: 'waitlisted', requested_bucket_key: 'dogs', counted: false
          )
        end

        it 'converts it to a confirmed GM signup' do
          result = subject.call!
          signup.reload

          assert_equal [signup], result.converted_signups
          refute signup.counted?
          assert_nil signup.bucket_key
          assert_equal 'confirmed', signup.state
        end
      end

      describe 'blocking someone in the waitlist' do
        let(:signup) do
          create(
            :signup,
            run: the_run, user_con_profile: user_con_profile,
            state: 'confirmed', bucket_key: 'dogs', requested_bucket_key: 'dogs', counted: true
          )
        end
        let(:waitlist_signup) do
          create(
            :signup,
            run: the_run,
            state: 'waitlisted', requested_bucket_key: 'dogs', counted: false
          )
        end

        before do
          signup
          create_list(
            :signup, 2,
            run: the_run, state: 'confirmed', bucket_key: 'dogs', requested_bucket_key: 'dogs', counted: true
          )
          waitlist_signup
        end

        it 'pulls in the waitlisted person' do
          result = subject.call!
          signup.reload
          waitlist_signup.reload

          assert_equal [signup], result.converted_signups
          assert_equal [waitlist_signup], result.move_results.map(&:signup)
          assert waitlist_signup.counted?
          assert_equal 'dogs', waitlist_signup.bucket_key
          assert_equal 'confirmed', waitlist_signup.state
        end
      end
    end
  end
end
