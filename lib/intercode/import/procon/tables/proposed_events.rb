class Intercode::Import::Procon::Tables::ProposedEvents < Intercode::Import::Procon::Table
  include Intercode::Import::Procon::EventHelpers
  include Intercode::Import::Procon::UserHelpers

  def initialize(connection, convention_id_map, person_id_map)
    super connection
    @markdownifier = Intercode::Import::Markdownifier.new(logger)
    @convention_id_map = convention_id_map
    @person_id_map = person_id_map
  end

  def table_name
    :events
  end

  def dataset
    super.where(type: 'ProposedEvent').exclude(parent_id: nil)
  end

  private

  def build_record(row)
    convention = @convention_id_map[row[:parent_id]]
    proposal = convention.event_proposals.new(
      event_category: convention.event_categories.find_by!(name: 'Larp'),
      status: accepted?(row) ? 'accepted' : 'reviewing',
      owner: user_con_profile_for_person_id(row[:proposer_id], convention)
    )
    proposal.assign_form_response_attributes(form_response_attributes(row))
    proposal
  end

  def form_response_attributes(row)
    {
      title: row[:fullname],
      short_name: row[:shortname],
      short_blurb: row[:blurb] || row[:description],
      description: row[:description] || row[:blurb],
      can_play_concurrently: can_play_concurrently?(row),
      age_restrictions: age_restrictions(row),
      proposed_timing: row[:proposed_timing],
      proposal_comments: row[:proposal_comments],
      proposed_location: row[:proposed_location],
      proposed_capacity_limits: row[:proposed_capacity_limits]
    }
  end

  def accepted?(row)
    connection[:events].where(proposed_event_id: row[:id]).any?
  end
end
