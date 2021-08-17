module FormResponseAttrsFields
  extend ActiveSupport::Concern

  included do
    field :form_response_attrs_json, Types::JSON, null: true
    field :form_response_attrs_json_with_rendered_markdown, Types::JSON, null: true
  end

  def form_response_attrs_json
    form.then do |form|
      AssociationLoader.for(Form, :form_items).load(form).then do |_form_items|
        FormResponsePresenter.new(form, object).as_json
      end
    end
  end

  def form_response_attrs_json_with_rendered_markdown
    form.then do |form|
      AssociationLoader.for(Form, :form_items).load(form).then do |_form_items|
        viewer_roles = Pundit.policy(context[:pundit_user], object).form_item_roles
        team_member_name = event_category&.team_member_name if respond_to?(:event_category)

        FormResponsePresenter.new(
          form,
          object,
          viewer_roles: viewer_roles,
          team_member_name: team_member_name
        ).as_json_with_rendered_markdown('event', object, '')
      end
    end
  end
end
