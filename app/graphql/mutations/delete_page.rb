class Mutations::DeletePage < Mutations::BaseMutation
  field :page, Types::PageType, null: false

  argument :id, Integer, required: true

  load_and_authorize_cms_model :pages, :id, :destroy

  def resolve(**_args)
    page.destroy!
    { page: page }
  end
end
