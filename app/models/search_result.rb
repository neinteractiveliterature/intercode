class SearchResult
  class Entry
    attr_reader :document
    delegate :searchable, :pg_search_highlight, :pg_search_rank, to: :document
    alias_method :model, :searchable
    alias_method :highlight, :pg_search_highlight
    alias_method :rank, :pg_search_rank

    def initialize(document)
      @document = document
    end

    def model_type
      model.class.name
    end

    def title
      case model
      when Event then model.title
      when Page then model.name
      else "#{model_type} #{model.id}"
      end
    end
  end

  def self.convention_search(query, convention_id, limit: 10)
    scope = PgSearch.multisearch(query)
      .where(convention_id: convention_id)
      .includes(:searchable)

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
    @entries ||= @scope.with_pg_search_highlight.with_pg_search_rank.limit(limit)
      .map { |document| SearchResult::Entry.new(document) }
  end
end
