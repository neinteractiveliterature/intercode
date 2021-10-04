# frozen_string_literal: true
class Mutations::UpdatePage < Mutations::BaseMutation
  field :page, Types::PageType, null: false

  argument :id,
           Integer,
           deprecation_reason:
             'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
           required: false
  argument :transitional_id, ID, required: false, camelize: true
  argument :page, Types::PageInputType, required: true

  load_and_authorize_cms_model :pages, :id, :update

  def resolve(**args)
    page.update!(args[:page].to_h)

    { page: page }
  end
end
