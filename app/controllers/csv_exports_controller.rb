class CsvExportsController < ApplicationController
  class RunSignupsFilenameFinder
    PRIORITIZED_FILENAME_GENERATORS = [
      ->(run) { run.event.title },
      ->(run) { "#{run.event.title} (#{run.title_suffix})" },
      ->(run) { "#{run.event.title} (#{format_run_start_day(run)})" },
      ->(run) { "#{run.event.title} (#{format_run_start_time(run)})" },
      ->(run) { "#{run.event.title} (#{format_run_rooms(run)})" },
      ->(run) { "#{run.event.title} (#{format_run_start_day(run)} in #{format_run_rooms(run)})" },
      ->(run) { "#{run.event.title} (#{format_run_start_time(run)} in #{format_run_rooms(run)})" },
      ->(run) { "#{run.event.title} (run #{run.id})" }
    ]

    def format_run_start_day(run)
      run.starts_at.strftime('%a')
    end

    def format_run_start_time(run)
      run.starts_at.strftime('%a %-l:%M%P')
    end

    def format_run_rooms(run)
      run.rooms.map(&:name).sort.to_sentence
    end

    # Find a filename that will be unique across all runs, using a variety of filename generation
    # strategies
    def unique_filename(event, run, suffix)
      filename_generator = PRIORITIZED_FILENAME_GENERATORS.find do |generator|
        filenames = event.runs.map { |r| generator.call(r) }
        filenames.uniq.size == filenames.size
      end

      "#{filename_generator.call(run)} #{suffix}"
    end
  end

  include SendCsv

  def event_proposals
    # Even if the user can manage some event proposals (i.e. their own), only
    # allow access to this action if they can manage arbitrary ones in this con
    authorize convention, :view_event_proposals?

    send_table_presenter_csv(
      Tables::EventProposalsTableResultsPresenter.for_convention(
        convention,
        pundit_user,
        params[:filters]&.to_unsafe_h,
        params[:sort],
        params[:columns]
      ),
      "Event proposals - #{convention.name}"
    )
  end

  def orders
    authorize Order.new(user_con_profile: UserConProfile.new(convention: convention)), :read?

    send_table_presenter_csv(
      Tables::OrdersTableResultsPresenter.for_convention(
        convention,
        params[:filters]&.to_unsafe_h,
        params[:sort]
      ),
      "#{convention.name} Orders"
    )
  end

  def run_signups
    run = convention.runs.includes(:event).find(params[:run_id])
    authorize Signup.new(run: run), :read?

    send_table_presenter_csv(
      Tables::SignupsTableResultsPresenter.for_run(
        run,
        pundit_user,
        params[:filters]&.to_unsafe_h,
        params[:sort],
        params[:columns]
      ),
      RunSignupsFilenameFinder.new.unique_filename(run.event, run, 'Signups')
    )
  end

  def signup_changes
    scope = SignupChangePolicy::Scope.new(
      pundit_user,
      convention.signup_changes.includes([
        :user_con_profile,
        run: :event,
        signup: { user_con_profile: :signups }
      ])
    )
    send_table_presenter_csv(
      Tables::SignupChangesTableResultsPresenter.new(
        scope.resolve,
        params[:filters]&.to_unsafe_h,
        [{ field: 'created_at', desc: true }],
        params[:columns]
      ),
      [convention.name, 'Signup Changelog', Time.zone.today.iso8601].compact.join(' - ')
    )
  end

  def user_con_profiles
    authorize convention, :view_attendees?

    send_table_presenter_csv(
      Tables::UserConProfilesTableResultsPresenter.for_convention(
        convention,
        pundit_user,
        params[:filters]&.to_unsafe_h,
        params[:sort],
        params[:columns]
      ),
      "#{convention.name} Attendees"
    )
  end

  def users
    authorize User.new, :read?

    send_table_presenter_csv(
      Tables::UsersTableResultsPresenter.new(
        policy_scope(User.all),
        params[:filters]&.to_unsafe_h,
        params[:sort],
        params[:columns]
      ),
      'Users'
    )
  end
end
