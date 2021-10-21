# frozen_string_literal: true
class Mutations::DeletePage < Mutations::BaseMutation
  field :page, Types::PageType, null: false

  argument :transitional_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :id, ID, required: false

  load_and_authorize_cms_model :pages, :id, :destroy

  def resolve(**_args)
    page.destroy!
    { page: page }
  end
end
