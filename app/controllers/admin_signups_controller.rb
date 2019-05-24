class AdminSignupsController < ApplicationController
  PRIORITIZED_FILENAME_GENERATORS = [
    ->(run) { run.event.title },
    ->(run) { "#{run.event.title} (#{run.title_suffix})" },
    ->(run) { "#{run.event.title} (#{run.starts_at.strftime('%a %-l:%M%P')})" },
    ->(run) { "#{run.event.title} (#{run.rooms.map(&:name).sort.to_sentence})" },
    ->(run) { "#{run.event.title} (#{run.starts_at.strftime('%a %-l:%M%P')} in #{run.rooms.map(:name).sort.to_sentence})" },
    ->(run) { "#{run.event.title} (run #{run.id})" }
  ]

  include Concerns::SendCsv

  load_resource :event, through: :convention
  load_resource :run, through: :event
  load_and_authorize_resource class: Signup

  def export
    respond_to do |format|
      format.csv do
        title_suffix = if @run.title_suffix.present?
          " (#{@run.title_suffix})"
        else
          ''
        end

        send_table_presenter_csv(
          Tables::SignupsTableResultsPresenter.for_run(
            @run,
            params[:filters]&.to_unsafe_h,
            params[:sort],
            params[:columns]
          ),
          unique_filename
        )
      end
    end
  end

  private

  # Find a filename that will be unique across all runs, using a variety of filename generation
  # strategies
  def unique_filename
    filename_generator = PRIORITIZED_FILENAME_GENERATORS.find do |generator|
      filenames = @event.runs.map { |run| generator.call(run) }
      filenames.uniq.size == filenames.size
    end

    "#{filename_generator.call(@run)} Signups"
  end
end
