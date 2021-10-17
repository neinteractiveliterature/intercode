# frozen_string_literal: true
class Queries::OAuthScopedDisjunction
  def self.evaluate(authorization_info)
    disjunction = new(authorization_info)
    yield disjunction
    disjunction.value
  end

  attr_reader :authorization_info

  def initialize(authorization_info)
    @authorization_info = authorization_info
    @clauses = []
  end

  def add_clause(&block)
    @clauses << block
  end

  def add(scope)
    add_clause { authorization_info.oauth_scope?(scope) && yield }
  end

  def value
    @clauses.any?(&:call)
  end
end
