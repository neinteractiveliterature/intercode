class AdminSignupsController < ApplicationController
  def self.format_run_start_day(run)
    run.starts_at.strftime('%a')
  end

  def self.format_run_start_time(run)
    run.starts_at.strftime('%a %-l:%M%P')
  end

  def self.format_run_rooms(run)
    run.rooms.map(&:name).sort.to_sentence
  end

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

  # Find a filename that will be unique across all runs, using a variety of filename generation
  # strategies
  def self.unique_filename(event, run, suffix)
    filename_generator = PRIORITIZED_FILENAME_GENERATORS.find do |generator|
      filenames = event.runs.map { |r| generator.call(r) }
      filenames.uniq.size == filenames.size
    end

    "#{filename_generator.call(run)} #{suffix}"
  end

  include SendCsv

  def export
    event = convention.events.find(params[:event_id])
    run = event.runs.find(params[:run_id])
    authorize Signup.new(run: run), :read?

    respond_to do |format|
      format.csv do
        send_table_presenter_csv(
          Tables::SignupsTableResultsPresenter.for_run(
            run,
            pundit_user,
            params[:filters]&.to_unsafe_h,
            params[:sort],
            params[:columns]
          ),
          AdminSignupsController.unique_filename(event, run, 'Signups')
        )
      end
    end
  end
end
