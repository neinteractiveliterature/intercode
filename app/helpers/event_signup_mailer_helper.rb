module EventSignupMailerHelper
  def signup_description(signup, action_description, html: false)
    safe_join(
      [
        user_con_profile_description(signup.user_con_profile, html: html),
        action_description,
        "#{run_description(signup.run)}."
      ],
      ' '
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

  def user_con_profile_description(user_con_profile, html: false)
    if html
      mail_to(user_con_profile.email, user_con_profile.name_without_nickname)
    else
      "#{user_con_profile.name_without_nickname} (#{user_con_profile.email})"
    end
  end

  def move_result_description(move_result, show_buckets: false, html: false)
    move_result = SignupMoveResult.from_h(move_result) if move_result.is_a?(Hash)
    signup = move_result.signup

    safe_join(
      [
        user_con_profile_description(signup.user_con_profile, html: html),
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
