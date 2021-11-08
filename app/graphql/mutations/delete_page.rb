# frozen_string_literal: true
class Mutations::DeletePage < Mutations::BaseMutation
  field :page, Types::PageType, null: false

  argument :id, ID, required: false

  load_and_authorize_cms_model :pages, :id, :destroy

  def resolve(**_args)
    page.destroy!
    { page: page }
  end
end
