# frozen_string_literal: true
class Mutations::DeleteCmsFile < Mutations::BaseMutation
  field :cms_file, Types::CmsFileType, null: false

  argument :transitional_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :id, ID, required: false

  load_and_authorize_cms_model :cms_files, :id, :destroy

  def resolve(**_args)
    cms_file.file.remove!
    cms_file.destroy!
    { cms_file: cms_file }
  end
end
