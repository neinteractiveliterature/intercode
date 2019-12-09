class EventSignupMailer < ApplicationMailer
  include ActionView::Helpers::OutputSafetyHelper
  include ActionView::Helpers::UrlHelper

  def new_signup(signup, team_member)
    notification_template_mail(
      signup.event.convention,
      'signups/new_signup',
      {
        'signup' => signup,
        'run_description' => run_description(signup.run),
        'signup_description' => signup_description(signup, 'has signed up for'),
        'all_signups_description' => SignupCountPresenter.new(signup.run).signups_description
      },
      from: from_address_for_convention(signup.event.convention),
      to: team_member.user_con_profile.email
    )
  end

  def withdrawal(signup, prev_state, prev_bucket_key, move_results, team_member)
    if prev_bucket_key
      prev_bucket = signup.event.registration_policy.bucket_with_key(prev_bucket_key)
    end

    notification_template_mail(
      signup.event.convention,
      'signups/withdrawal',
      {
        'signup' => signup,
        'prev_state' => prev_state,
        'run_description' => run_description(signup.run),
        'signup_description' => signup_description(signup, 'has withdrawn from'),
        'prev_state_description' => prev_state_description(prev_state, prev_bucket),
        'move_result_descriptions' => move_results.map do |move_result|
          move_result_description(move_result, show_buckets: true)
        end,
        'all_signups_description' => SignupCountPresenter.new(signup.run).signups_description
      },
      from: from_address_for_convention(signup.event.convention),
      to: team_member.user_con_profile.email
    )
  end

  def registration_policy_change_moved_signups(event, move_results, team_member, whodunit)
    @event = event
    @move_results = move_results.map { |hash| SignupMoveResult.from_h(hash) }
    @whodunit = whodunit

    @signups_by_id = Signup.where(id: @move_results.map(&:signup_id)).includes(:run).index_by(&:id)
    @move_results_by_run = @move_results.group_by do |move_result|
      @signups_by_id[move_result.signup_id].run
    end
    @runs = @move_results_by_run.keys.sort_by(&:starts_at)

    use_convention_timezone(@event.convention) do
      mail(
        from: from_address_for_convention(@event.convention),
        to: team_member.user_con_profile.email,
        subject: "#{subject_prefix(@event)} Signups moved due to bucket changes"
      )
    end
  end

  def user_signup_moved(move_result)
    @move_result = move_result
    @move_result = SignupMoveResult.from_h(@move_result) if @move_result.is_a?(Hash)
    @signup = @move_result.signup

    if @move_result.prev_state == 'waitlisted'
      subject = 'Signup confirmed'
    else
      subject = 'Signup status change'
    end

    use_convention_timezone(@signup.event.convention) do
      mail(
        from: from_address_for_convention(@signup.event.convention),
        to: @signup.user_con_profile.email,
        subject: "#{subject_prefix(@signup.event)} #{subject}"
      )
    end
  end

  private

  def subject_prefix(event)
    "[#{event.convention.name}: #{event.title}]"
  end

  def signup_description(signup, action_description)
    safe_join(
      [
        user_con_profile_description(signup.user_con_profile),
        ' ',
        action_description,
        ' ',
        "#{run_description(signup.run)}. ",
        "They are currently #{signup.state}",
        *[
          if signup.bucket_key
            [
              " in the #{bucket_description(signup.event.registration_policy, signup.bucket_key)} bucket",
              *[
                if signup.requested_bucket_key
                  '.'
                else
                  ' (but have no bucket preference).'
                end
              ]
            ]
          else
            ['.']
          end
        ]
      ],
      ''
    )
  end

  def prev_state_description(prev_state, prev_bucket)
    bucket_description = prev_bucket ? " in the #{prev_bucket.name} bucket" : ''
    "(Previously, they were #{prev_state}#{bucket_description}.)"
  end

  def run_description(run)
    if run.event.runs.size > 1
      "#{run.event.title} on #{run.starts_at.to_s(:long_with_weekday)}"
    else
      run.event.title
    end
  end

  def user_con_profile_description(user_con_profile)
    mail_to(user_con_profile.email, user_con_profile.name_without_nickname)
  end

  def move_result_description(move_result, show_buckets: false)
    move_result = SignupMoveResult.from_h(move_result) if move_result.is_a?(Hash)
    signup = move_result.signup

    safe_join(
      [
        user_con_profile_description(signup.user_con_profile),
        ': ',
        prev_signup_state_description(move_result, show_buckets: show_buckets),
        ' → ',
        new_signup_state_description(move_result, show_buckets: show_buckets)
      ],
      ''
    )
  end

  def prev_signup_state_description(move_result, show_buckets: false)
    [
      move_result.prev_state.humanize,
      (
        if show_buckets
          description = bucket_description(
            move_result.signup.run.registration_policy,
            move_result.prev_bucket_key
          )

          "(#{description})" if description
        end
      )
    ].compact.join(' ')
  end

  def new_signup_state_description(move_result, show_buckets: false)
    [
      move_result.state.humanize,
      (
        if show_buckets
          description = bucket_description(
            move_result.signup.run.registration_policy,
            move_result.bucket_key
          )

          "(#{description})" if description
        end
      )
    ].compact.join(' ')
  end

  def bucket_description(registration_policy, bucket_key)
    return unless bucket_key

    bucket = registration_policy.bucket_with_key(bucket_key)
    if bucket
      bucket.name || bucket.key
    else
      "deleted bucket #{bucket_key}"
    end
  end
end
