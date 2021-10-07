# frozen_string_literal: true
class Mutations::CreatePage < Mutations::BaseMutation
  field :page, Types::PageType, null: false

  argument :page, Types::PageInputType, required: true

  authorize_create_cms_model :pages

  def resolve(**args)
    attrs = process_transitional_ids_in_input(args[:page].to_h, :cms_layout_id)
    page = cms_parent.pages.create!(attrs)

    { page: page }
  end
end
