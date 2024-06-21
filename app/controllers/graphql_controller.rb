# frozen_string_literal: true
class GraphqlController < ApplicationController
  class Context
    METHODS =
      {
        current_user: :current_user,
        pundit_user: :pundit_user,
        user_con_profile: :user_con_profile,
        convention: :convention,
        cadmus_renderer: :cadmus_renderer,
        current_pending_order: :current_pending_order,
        assumed_identity_from_profile: :assumed_identity_from_profile,
        verified_request: :verified_request?,
        timezone_for_request: :timezone_for_request
      }.transform_values { |method_name| ApplicationController.instance_method(method_name) }

    def initialize(controller, **values)
      @controller = controller
      @values = values
    end

    def key?(key)
      key = key.to_sym
      return true if key == :controller
      return true if METHODS.key?(key)
      @values.key?(key)
    end

    def [](key)
      key = key.to_sym
      if key == :controller
        @controller
      elsif METHODS.key?(key)
        @values[key] ||= METHODS[key].bind_call(@controller)
        @values[key]
      else
        @values[key]
      end
    end

    def fetch(key, default = nil)
      raise KeyError unless default || @values.key?(key) || METHODS.key?(key)
      self[key] || default
    end

    def []=(key, value)
      @values[key] = value
    end

    def delete(key)
      @values.delete(key)
    end

    def dup
      Context.new(@controller, **@values.dup)
    end
  end

  skip_before_action :verify_authenticity_token # We're doing this in MutationType.authorized?
  skip_before_action :ensure_user_con_profile_exists
  skip_before_action :redirect_if_user_con_profile_needs_update
  skip_before_action :ensure_clickwrap_agreement_accepted

  def execute
    ActiveRecord::Base.transaction do
      result = clean_backtraces(execute_from_params(params))
      render json: result

      is_error =
        case result
        when Array
          result.any? { |query_result| query_result["errors"].present? }
        else
          result["errors"].present?
        end

      raise ActiveRecord::Rollback if is_error
    end
  end

  private

  def execute_from_params(params)
    context = Context.new(self)

    # Apollo sends the queries in an array when batching is enabled. The data ends up in the _json field of the params
    # variable.  See the Apollo Documentation about query batching:
    # https://www.apollographql.com/docs/react/api/link/apollo-link-batch-http/
    if params[:_json]
      queries =
        params[:_json].map do |param|
          query_context = context.dup
          query_context[:set_sentry_transaction_name] = param[:operationName]
          {
            query: param[:query],
            operation_name: param[:operationName],
            variables: ensure_hash(param[:variables]),
            context: query_context
          }
        end
      IntercodeSchema.multiplex(queries)
    else
      context[:set_sentry_transaction_name] = params[:operationName]
      IntercodeSchema.execute(params[:query], operation_name: params[:operationName], variables:, context:)
    end
  end

  def clean_backtraces(result)
    return result.map { |query_result| clean_backtraces(query_result) } if result.is_a?(Array)
    return result if result["errors"].blank?
    return result if Rails.configuration.consider_all_requests_local

    result.merge(
      "errors" =>
        result["errors"].map do |error|
          next error if error["extensions"].blank?
          error.merge("extensions" => error["extensions"].except("backtrace"))
        end
    )
  end

  def variables
    @variables ||= ensure_hash(params[:variables])
  end

  # Handle form data, JSON body, or a blank value
  def ensure_hash(ambiguous_param)
    case ambiguous_param
    when String
      ambiguous_param.present? ? ensure_hash(JSON.parse(ambiguous_param)) : {}
    when Hash, ActionController::Parameters
      ambiguous_param
    when nil
      {}
    else
      raise ArgumentError, "Unexpected parameter: #{ambiguous_param}"
    end
  end

  def assumed_identity_request_log_attributes
    super.merge(
      { graphql_operation_name: params[:operationName], graphql_document: params[:query], graphql_variables: variables }
    )
  end
end
