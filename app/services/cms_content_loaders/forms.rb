# frozen_string_literal: true
class CmsContentLoaders::Forms < CmsContentLoaders::Base
  private

  def persister
    @persister ||= CmsContentPersisters::Forms.new(cms_parent, content_set)
  end

  def load_content(&block)
    super(&block)
    cms_parent.save!
  end

  def create_item(_item, attrs)
    form =
      case attrs['form_type']
      when 'user_con_profile'
        cms_parent.create_user_con_profile_form!(convention: cms_parent, form_type: attrs['form_type'])
      else
        cms_parent.forms.create!(convention: cms_parent, form_type: attrs['form_type'])
      end

    ImportFormContentService.new(form: form, content: attrs).call!
  end
end
