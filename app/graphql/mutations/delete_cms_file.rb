# frozen_string_literal: true
class Mutations::DeleteCmsFile < Mutations::BaseMutation
  field :cms_file, Types::CmsFileType, null: false

  argument :id,
           Integer,
           deprecation_reason:
             'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
           required: false
  argument :transitional_id, ID, required: false, camelize: true

  load_and_authorize_cms_model :cms_files, :id, :destroy

  def resolve(**_args)
    cms_file.file.remove!
    cms_file.destroy!
    { cms_file: cms_file }
  end
end
