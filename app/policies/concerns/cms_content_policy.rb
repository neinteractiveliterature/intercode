module CmsContentPolicy
  extend ActiveSupport::Concern

  class DefaultScope < ApplicationPolicy::Scope
    def resolve
      scope.all
    end
  end

  class DefaultManageScope < ApplicationPolicy::Scope
    def resolve
      return scope if site_admin?

      disjunctive_where do |dw|
        if oauth_scope?(:manage_conventions)
          model_name = self.class.name.split('::')[-2].gsub(/Policy\z/, '')

          dw.add(
            parent_type: 'Convention', parent_id: conventions_with_permission('update_cms_content')
          )
          dw.add(
            id: CmsContentGroupAssociation.where(
              content_type: model_name,
              cms_content_group_id: cms_content_groups_with_permission('update_content').select(:id)
            ).select(:content_id)
          )
        end
      end
    end
  end

  def read?
    true
  end

  def manage?
    return true if oauth_scoped_disjunction do |d|
      d.add(:manage_conventions) do
        has_convention_permission?(convention, 'update_cms_content') ||
        (
          record.respond_to?(:cms_content_groups) &&
          group_ids_with_update_content_in_convention.any? do |id|
            record.cms_content_group_ids.include?(id)
          end
        )
      end
    end

    super
  end

  included do
    const_set('Scope', Class.new(CmsContentPolicy::DefaultScope))
    const_set('ManageScope', Class.new(CmsContentPolicy::DefaultManageScope))
  end

  private

  def convention
    return record.parent if record.parent.is_a?(Convention)

    nil
  end

  def group_ids_with_update_content_in_convention
    cms_content_group_ids_with_permission_in_convention(convention, 'update_content')
  end
end
