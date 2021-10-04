# frozen_string_literal: true
class Mutations::DeletePage < Mutations::BaseMutation
  field :page, Types::PageType, null: false

  argument :id,
           Integer,
           deprecation_reason:
             'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
           required: false
  argument :transitional_id, ID, required: false, camelize: true

  load_and_authorize_cms_model :pages, :id, :destroy

  def resolve(**_args)
    page.destroy!
    { page: page }
  end
end
