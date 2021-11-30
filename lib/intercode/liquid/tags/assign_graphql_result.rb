module Intercode
  module Liquid
    module Tags
      # Runs a given GraphQL query (defined in the CMS tab "GraphQL queries") and assigns the
      # result to a variable.
      class AssignGraphqlResult < ::Liquid::Tag
        Syntax = /(#{::Liquid::VariableSignature}+)\s*=\s*(\w+)(\((\w+: #{::Liquid::VariableSignature}+,?)*\))?\s*/om

        attr_reader :destination_variable, :query_identifier, :variable_defs

        def initialize(tag_name, args, _options)
          super

          match = Syntax.match(args)
          raise SyntaxError, 'Invalid assign_graphql_result syntax' unless match

          @destination_variable = match[1]
          @query_identifier = match[2]
          if match[4]
            @variable_defs =
              match[4]
                .split(',')
                .each_with_object({}) do |variable_def, hash|
                  variable_name, from = variable_def.split(':').map(&:strip)
                  hash[variable_name] = from
                end
          else
            @variable_defs = {}
          end
        end

        def render(context)
          cms_graphql_query =
            CmsGraphqlQuery.find_by(parent: context['convention'].convention, identifier: query_identifier)

          variables = variable_defs.transform_values { |variable_name| context[variable_name] }

          result = cms_graphql_query.execute(context: graphql_context(context), variables: variables)
          hash_result = result.to_h

          context.scopes.last[destination_variable] = hash_result['data']
          result_errors =
            hash_result['errors']&.reject do |err|
              hash_result['data'].present? && err['extensions'] &&
                %w[NOT_AUTHENTICATED NOT_AUTHORIZED].include?(err['extensions']['code'])
            end
          result_errors ? result_errors.map { |error| error['message'] }.join(', ') : ''.freeze
        end

        def blank?
          true
        end

        def graphql_context(context)
          if context.registers['controller']
            GraphqlController::Context.new(context.registers['controller'], query_from_liquid: true)
          else
            context.registers.with_indifferent_access
          end
        end
      end
    end
  end
end

Liquid::Template.register_tag('assign_graphql_result', Intercode::Liquid::Tags::AssignGraphqlResult)
