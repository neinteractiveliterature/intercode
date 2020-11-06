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
        can_view_hidden_values = Pundit.policy(context[:pundit_user], object).view_hidden_values?
        FormResponsePresenter.new(form, object, can_view_hidden_values: can_view_hidden_values)
          .as_json_with_rendered_markdown('event', object, '')
      end
    end
  end
end
