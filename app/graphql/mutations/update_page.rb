class Mutations::UpdatePage < Mutations::BaseMutation
  field :page, Types::PageType, null: false

  argument :id, Integer, required: true
  argument :page, Types::PageInputType, required: true

  def resolve(**args)
    page = cms_parent.pages.find(args[:id])
    page.update!(args[:page].to_h)

    { page: page }
  end
end
