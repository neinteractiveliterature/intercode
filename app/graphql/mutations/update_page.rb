# frozen_string_literal: true
class Mutations::UpdatePage < Mutations::BaseMutation
  field :page, Types::PageType, null: false

  argument :transitional_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :id, ID, required: false
  argument :page, Types::PageInputType, required: true

  load_and_authorize_cms_model :pages, :id, :update

  def resolve(**args)
    attrs = process_transitional_ids_in_input(args[:page].to_h, :cms_layout_id)
    page.update!(attrs)

    { page: page }
  end
end
