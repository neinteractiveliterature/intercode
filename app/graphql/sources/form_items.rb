# frozen_string_literal: true
class Sources::FormItems < GraphQL::Dataloader::Source
  def fetch(keys)
    clauses = keys.map do |(form_id, identifier)|
      "(forms.id = #{ActiveRecord::Base.connection.quote form_id} AND identifier = #{ActiveRecord::Base.connection.quote identifier})"
    end
    form_items_scope = FormItem.joins(:form).includes(:form).where(clauses.join(" OR "))

    form_items_by_key = form_items_scope.to_a.index_by { |item| [item.form.id, item.identifier] }
    keys.map { |key| form_items_by_key[key] }
  end
end
