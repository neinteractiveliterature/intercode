# frozen_string_literal: true
module FormResponseAttrsFields
  extend ActiveSupport::Concern

  included do
    field :current_user_form_item_viewer_role, Types::FormItemRoleType, null: false
    field :current_user_form_item_writer_role, Types::FormItemRoleType, null: false
    field :form_response_attrs_json, Types::JSON, null: true do
      argument :item_identifiers, [String], required: false
    end
    field :form_response_attrs_json_with_rendered_markdown, Types::JSON, null: true do
      argument :item_identifiers, [String], required: false
    end
  end

  def form_response_attrs_json(item_identifiers: nil)
    form.then do |form|
      items_promise =
        if item_identifiers
          FormItemsLoader.for.load_many(item_identifiers.map { |item_identifier| [form.id, item_identifier] })
        else
          dataloader.with(Sources::ActiveRecordAssociation, Form, :form_items).load(form)
        end

      items_promise.then do |form_items|
        FormResponsePresenter.new(
          form,
          object,
          viewer_role: current_user_form_item_viewer_role,
          team_member_name: respond_to?(:event_category) ? event_category&.team_member_name : nil,
          controller: context[:controller],
          preloaded_form_items: form_items
        ).as_json(only_items: item_identifiers)
      end
    end
  end

  def form_response_attrs_json_with_rendered_markdown(item_identifiers: nil)
    form.then do |form|
      items_promise =
        if item_identifiers
          FormItemsLoader.for.load_many(item_identifiers.map { |item_identifier| [form.id, item_identifier] })
        else
          dataloader.with(Sources::ActiveRecordAssociation, Form, :form_items).load(form)
        end

      items_promise.then do |form_items|
        FormResponsePresenter.new(
          form,
          object,
          viewer_role: current_user_form_item_viewer_role,
          team_member_name: respond_to?(:event_category) ? event_category&.team_member_name : nil,
          controller: context[:controller],
          preloaded_form_items: form_items
        ).as_json_with_rendered_markdown("event", object, "", only_items: item_identifiers)
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
