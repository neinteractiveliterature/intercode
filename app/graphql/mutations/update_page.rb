class Mutations::UpdatePage < Mutations::BaseMutation
  field :page, Types::PageType, null: false

  argument :id, Integer, required: true
  argument :page, Types::PageInputType, required: true

  load_and_authorize_cms_model :pages, :id, :update

  def resolve(**args)
    page.update!(args[:page].to_h)

    { page: page }
  end
end
