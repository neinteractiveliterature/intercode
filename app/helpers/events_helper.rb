module EventsHelper
  def signup_button(event, run, signup_option)
    url = event_run_user_signup_path(event, run, signup_option.params)

    link_to url, method: 'POST', class: "btn mx-1 mb-2 #{signup_option.button_class}", title: signup_option.help_text do
      safe_join([
        content_tag(:strong, 'Sign up'),
        *(signup_option.label.present? ? [tag(:br), signup_option.label] : [])
      ])
    end
  end

  def runs_section(event)
    app_component 'RunsSectionScaffold', eventId: event.id

    # signup_count_presenters = SignupCountPresenter.for_runs(event.runs)
    # user_signups = user_con_profile ? user_con_profile.signups : []
    #
    # app_component(
    #   'RunsSection',
    #   event: {
    #     id: event.id,
    #     title: event.title,
    #     registration_policy: event.registration_policy.as_json,
    #     length_seconds: event.length_seconds,
    #     runs: event.runs.map do |run|
    #       {
    #         id: run.id,
    #         title_suffix: run.title_suffix,
    #         starts_at: run.starts_at,
    #         rooms: run.rooms.map { |room| { name: room.name } },
    #         my_signups: user_signups.select { |signup| signup.run_id == run.id }.map do |signup|
    #           {
    #             state: signup.state,
    #             waitlist_position: (
    #               if signup.waitlisted?
    #                 run.signups.waitlisted.where('created_at < ?', signup.created_at).count + 1
    #               else
    #                 nil
    #               end
    #             )
    #           }
    #         end,
    #         signup_count_by_state_and_bucket_key_and_counted:
    #           signup_count_presenters[run.id]
    #             .signup_count_by_state_and_bucket_key_and_counted
    #             .to_json
    #       }
    #     end
    #   },
    #   canReadSchedule: can?(:schedule, convention),
    #   timezoneName: convention.timezone_name
    # )
  end
end
