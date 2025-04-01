# frozen_string_literal: true
class ContentCloners::EarlyCmsContentCloner < ContentCloners::ContentClonerBase
  def clone(convention)
    clone_forms(convention)
    clone_cms_content_groups(convention)
  end

  private

  def clone_forms(convention)
    Rails.logger.info("Cloning forms")

    @id_maps[:forms] = clone_with_id_map(source_convention.forms, convention.forms) do |form, cloned_form|
      cloned_form.save!
      content = FormExportPresenter.new(form).as_json
      ImportFormContentService.new(form: cloned_form, content: content).call!
    end
  end

  def clone_cms_content_groups(convention)
    Rails.logger.info("Cloning CMS content groups")

    @id_maps[:cms_content_groups] = clone_with_id_map(
      source_convention.cms_content_groups,
      convention.cms_content_groups
    )
  end
end
