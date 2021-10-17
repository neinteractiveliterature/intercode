# frozen_string_literal: true
module FormResponseAttrsFields
  extend ActiveSupport::Concern

  included do
    field :current_user_form_item_viewer_role, Types::FormItemRoleType, null: false
    field :current_user_form_item_writer_role, Types::FormItemRoleType, null: false
    field :form_response_attrs_json, Types::JSON, null: true
    field :form_response_attrs_json_with_rendered_markdown, Types::JSON, null: true
  end

  def form_response_attrs_json
    form.then do |form|
      AssociationLoader
        .for(Form, :form_items)
        .load(form)
        .then do |_form_items|
          FormResponsePresenter.new(
            form,
            object,
            viewer_role: current_user_form_item_viewer_role,
            team_member_name: respond_to?(:event_category) ? event_category&.team_member_name : nil
          ).as_json
        end
    end
  end

  def form_response_attrs_json_with_rendered_markdown
    form.then do |form|
      AssociationLoader
        .for(Form, :form_items)
        .load(form)
        .then do |_form_items|
          FormResponsePresenter
            .new(
              form,
              object,
              viewer_role: current_user_form_item_viewer_role,
              team_member_name: respond_to?(:event_category) ? event_category&.team_member_name : nil
            )
            .as_json_with_rendered_markdown('event', object, '')
        end
    end
  end

  def current_user_form_item_viewer_role
    Pundit.policy(context[:pundit_user], object).form_item_viewer_role
  end

  def current_user_form_item_writer_role
    Pundit.policy(context[:pundit_user], object).form_item_writer_role
  end
end
