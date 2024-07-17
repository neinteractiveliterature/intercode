class GraphqlOperation
  def self.by_name(*names)
    json_data = JSON.parse(File.read(File.expand_path("graphql_operations_generated.json", __dir__)))
    names.map { |name| new(name: name, document: json_data.fetch(name)) }
  end

  attr_reader :document, :name

  def initialize(name:, document:)
    @document = document
    @name = name
  end

  def to_query_string
    document.fetch("document")
  end

  def to_document
    document.fetch("ast")
  end
end
