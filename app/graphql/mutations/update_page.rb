# frozen_string_literal: true
class Mutations::UpdatePage < Mutations::BaseMutation
  field :page, Types::PageType, null: false

  argument :id,
           Integer,
           deprecation_reason:
             "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
           required: false
  argument :transitional_id, ID, required: false, camelize: true
  argument :page, Types::PageInputType, required: true

  load_and_authorize_cms_model :pages, :id, :update

  def resolve(**args)
    attrs = process_transitional_ids_in_input(args[:page].to_h, :cms_layout_id)
    page.update!(attrs)

    { page: page }
  end
end
