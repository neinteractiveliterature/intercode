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
    scope = scope.where.not(searchable_type: "EventProposal") unless con_policy&.view_event_proposals?
    prefix_searchable_types = TITLE_PREFIX_SCOPES.keys
    unless con_policy&.view_attendees?
      scope = scope.where.not(searchable_type: "UserConProfile")
      prefix_searchable_types -= ["UserConProfile"]
    end

    new(scope, limit, title_prefix_scope: title_prefix_documents(query, convention_id, prefix_searchable_types))
  end

  # Full text search only matches whole words, so for each kind of thing with a title (or name) these
  # find the ones in a convention that have a word in it starting with the query
  TITLE_PREFIX_SCOPES = {
    "Event" => ->(convention_id, query) { Event.where(convention_id:).title_prefix(query) },
    "Page" => ->(convention_id, query) do
      pages =
        if convention_id
          Page.where(parent_type: "Convention", parent_id: convention_id)
        else
          Page.where(parent_type: [nil, "RootSite"])
        end
      pages.name_prefix(query)
    end,
    "UserConProfile" => ->(convention_id, query) { UserConProfile.where(convention_id:).name_prefix(query) }
  }.freeze

  # Documents for the things whose titles have a word starting with the query, so that typing the
  # start of a title finds it
  def self.title_prefix_documents(query, convention_id, searchable_types)
    searchable_types
      .map do |searchable_type|
        ids = TITLE_PREFIX_SCOPES.fetch(searchable_type).call(convention_id, query).reorder(nil).select(:id)
        PgSearch::Document.where(searchable_type:, searchable_id: ids, convention_id:, hidden_from_search: false)
      end
      .reduce(:or)
  end

  attr_reader :scope, :limit, :title_prefix_scope

  def initialize(scope, limit, title_prefix_scope: nil)
    @scope = scope.where(hidden_from_search: false)
    @limit = limit
    @title_prefix_scope = title_prefix_scope
  end

  def total_entries
    @total_entries ||= @scope.count + title_prefix_only_count
  end

  # Title prefix matches come first, then everything else the full text search found
  def entries
    @entries ||=
      (title_prefix_documents + other_full_text_documents)
        .first(limit)
        .map { |document| SearchResult::Entry.new(document) }
  end

  private

  def with_rank_and_highlight(documents)
    documents.with_pg_search_highlight.with_pg_search_rank
  end

  def title_prefix_only_count
    return 0 unless title_prefix_scope

    title_prefix_scope.where.not(id: @scope.reorder(nil).select(:id)).count
  end

  def other_full_text_documents
    others = title_prefix_scope ? @scope.where.not(id: title_prefix_scope.select(:id)) : @scope
    with_rank_and_highlight(others).limit(limit).to_a
  end

  # The documents that match on the start of a title, best full text matches first. Those the full
  # text search didn't find get a rank of zero and no highlight.
  def title_prefix_documents
    return [] unless title_prefix_scope

    documents = title_prefix_scope.select(<<~SQL.squish).to_a
      pg_search_documents.*, 0.0 AS pg_search_rank, NULL::text AS pg_search_highlight
    SQL
    full_text_matches = with_rank_and_highlight(@scope.where(id: documents.map(&:id))).index_by(&:id)

    documents.map { |document| full_text_matches[document.id] || document }.sort_by { |d| -d.pg_search_rank.to_f }
  end
end
