GRAPHQL_OPERATIONS_DATA = JSON.parse(File.read(File.expand_path('graphql_operations_generated.json', __dir__)))

class DeserializeNodeVisitor
  attr_reader :fragment_names

  def initialize
    @fragment_names = Set.new
  end

  def visit(node)
    case node.fetch('kind')
    when 'Argument' then visit_argument(node)
    when 'Field' then visit_field(node)
    when 'FragmentDefinition' then visit_fragment_definition(node)
    when 'FragmentSpread' then visit_fragment_spread(node)
    when 'InlineFragment' then visit_inline_fragment(node)
    when 'Name' then visit_name(node)
    when 'NamedType' then visit_named_type(node)
    when 'NonNullType' then visit_non_null_type(node)
    when 'OperationDefinition' then visit_operation_definition(node)
    when 'SelectionSet' then visit_selection_set(node)
    when 'VariableDefinition' then visit_variable_definition(node)
    when 'Variable' then visit_variable(node)
    else raise "Unknown node kind: #{node.fetch('kind')}"
    end
  end

  def visit_argument(node)
    GraphQL::Language::Nodes::Argument.new(
      name: visit(node.fetch('name')),
      value: visit(node.fetch('value'))
    )
  end

  def visit_field(node)
    GraphQL::Language::Nodes::Field.new(
      name: visit(node.fetch('name')),
      alias: node['alias'] ? visit(node.fetch('alias')) : nil,
      arguments: node.fetch('arguments').map { |n| visit(n) },
      directives: node.fetch('directives').map { |n| visit(n) },
      selections: node['selectionSet'] ? visit(node.fetch('selectionSet')) : nil
    )
  end

  def visit_fragment_definition(node)
    GraphQL::Language::Nodes::FragmentDefinition.new(
      name: visit(node.fetch('name')),
      type: visit(node.fetch('typeCondition')),
      directives: node.fetch('directives').map { |n| visit(n) },
      selections: node['selectionSet'] ? visit(node.fetch('selectionSet')) : nil
    )
  end

  def visit_fragment_spread(node)
    fragment_name = visit(node.fetch('name'))
    @fragment_names << fragment_name

    GraphQL::Language::Nodes::FragmentSpread.new(
      name: fragment_name,
      directives: node.fetch('directives').map { |n| visit(n) }
    )
  end

  def visit_inline_fragment(node)
    GraphQL::Language::Nodes::InlineFragment.new(
      type: visit(node.fetch('typeCondition')),
      directives: node.fetch('directives').map { |n| visit(n) },
      selections: node['selectionSet'] ? visit(node.fetch('selectionSet')) : nil
    )
  end

  def visit_name(node)
    node.fetch('value')
  end

  def visit_named_type(node)
    GraphQL::Language::Nodes::TypeName.new(
      name: visit(node.fetch('name'))
    )
  end

  def visit_non_null_type(node)
    GraphQL::Language::Nodes::NonNullType.new(
      of_type: visit(node.fetch('type'))
    )
  end

  def visit_variable(node)
    GraphQL::Language::Nodes::VariableIdentifier.new(
      name: visit(node.fetch('name'))
    )
  end

  def visit_variable_definition(node)
    GraphQL::Language::Nodes::VariableDefinition.new(
      name: visit(node.fetch('variable').fetch('name')),
      type: visit(node.fetch('type'))
    )
  end

  def visit_operation_definition(node)
    GraphQL::Language::Nodes::OperationDefinition.new(
      operation_type: node.fetch('operation'),
      name: visit(node.fetch('name')),
      variables: node.fetch('variableDefinitions').map { |n| visit(n) },
      directives: node.fetch('directives').map { |n| visit(n) },
      selections: visit(node.fetch('selectionSet'))
    )
  end

  def visit_selection_set(node)
    selections = node.fetch('selections').map { |n| visit(n) }

    return if selections.any? { |sel| sel.is_a?(GraphQL::Language::Nodes::Field) && sel.name == '__typename' }
    selections << GraphQL::Language::Nodes::Field.new(name: '__typename')

    selections
  end
end

class GraphqlOperation
  def self.by_name(name)
    new(GRAPHQL_OPERATIONS_DATA.fetch(name))
  end

  attr_reader :definition, :node, :fragment_definitions, :fragment_nodes
  delegate :name, to: :node

  def initialize(definition)
    @definition = definition
    visitor = DeserializeNodeVisitor.new
    @node = visitor.visit(definition)

    @fragment_definitions = {}
    @fragment_nodes = {}
    add_fragment_definitions(visitor.fragment_names)
  end

  def to_document
    { kind: 'Document', definitions: [definition, *fragment_definitions.values] }
  end

  def to_query_string
    [node.to_query_string, *fragment_nodes.values.map(&:to_query_string)].join("\n")
  end

  private

  def add_fragment_definitions(fragment_names)
    fragment_names.each do |fragment_name|
      next if @fragment_nodes[fragment_name]

      definition = GRAPHQL_OPERATIONS_DATA.fetch(fragment_name)
      visitor = DeserializeNodeVisitor.new
      @fragment_definitions[fragment_name] = definition
      @fragment_nodes[fragment_name] = visitor.visit(definition)
      add_fragment_definitions(visitor.fragment_names)
    end
  end
end
