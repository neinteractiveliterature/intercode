# frozen_string_literal: true
class SearchResult
  class Entry
    attr_reader :document
    delegate :searchable, :pg_search_highlight, :pg_search_rank, to: :document
    alias model searchable
    alias highlight pg_search_highlight
    alias rank pg_search_rank

    def initialize(document)
      @document = document
    end

    def model_type
      model.class.name
    end

    def title
      case model
      when Event, EventProposal
        model.title
      when Page
        model.name
      when UserConProfile
        model.name_without_nickname
      else
        "#{model_type} #{model.id}"
      end
    end
  end

  def self.full_text_site_search(query, convention_id, pundit_user, limit: 10)
    scope = PgSearch.multisearch(query).where(convention_id: convention_id).includes(:searchable)

    convention = convention_id && Convention.find(convention_id)
    con_policy = convention && Pundit.policy(pundit_user, convention)
    scope = scope.where.not(searchable_type: 'UserConProfile') unless con_policy&.view_attendees?
    scope = scope.where.not(searchable_type: 'EventProposal') unless con_policy&.view_event_proposals?

    new(scope, limit)
  end

  attr_reader :scope, :limit

  def initialize(scope, limit)
    @scope = scope.where(hidden_from_search: false)
    @limit = limit
  end

  def total_entries
    @total_entries ||= @scope.count
  end

  def entries
    @entries ||=
      @scope
        .with_pg_search_highlight
        .with_pg_search_rank
        .limit(limit)
        .map { |document| SearchResult::Entry.new(document) }
  end
end
