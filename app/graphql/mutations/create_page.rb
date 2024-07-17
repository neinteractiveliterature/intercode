# frozen_string_literal: true
class Mutations::CreatePage < Mutations::BaseMutation
  field :page, Types::PageType, null: false

  argument :page, Types::PageInputType, required: true

  authorize_create_cms_model :pages

  def resolve(**args)
    page = cms_parent.pages.create!(args[:page].to_h)

    { page: page }
  end
end
