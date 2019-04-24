class Mutations::DeletePage < Mutations::BaseMutation
  field :page, Types::PageType, null: false

  argument :id, Integer, required: true

  def resolve(**args)
    page = cms_parent.pages.find(args[:id])
    page.destroy!
    { page: page }
  end
end
