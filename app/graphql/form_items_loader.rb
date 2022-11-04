# frozen_string_literal: true
class FormItemsLoader < GraphQL::Batch::Loader
  attr_reader :form

  def initialize(form)
    @form = form
  end

  def perform(keys)
    form_items_scope = form.form_items.where(identifier: keys)

    form_items_by_identifier = form_items_scope.to_a.index_by(&:identifier)
    keys.each { |identifier| fulfill(identifier, form_items_by_identifier[identifier]) }
  end
end
