module Concerns::CmsContentPolicy
  extend ActiveSupport::Concern

  class DefaultScope < ApplicationPolicy::Scope
    def resolve
      scope.all
    end
  end

  def read?
    true
  end

  def manage?
    return true if oauth_scoped_disjunction do |d|
      d.add(:manage_conventions) { staff_in_convention?(convention) }
    end

    super
  end

  included do
    const_set('Scope', Concerns::CmsContentPolicy::DefaultScope)
  end

  private

  def convention
    return record.parent if record.parent.is_a?(Convention)

    nil
  end
end
