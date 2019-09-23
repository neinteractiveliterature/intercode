require 'test_helper'

describe LoadCmsContentSetService do
  let(:convention) { create(:convention) }
  let(:service) { LoadCmsContentSetService.new(convention: convention, content_set_name: 'standard') }

  before do
    convention.forms.destroy_all
    convention.reload
  end

  describe 'successfully loading content' do
    before do
      @result = service.call
    end

    it 'returns a success result' do
      assert @result.success?
    end

    it 'loads pages' do
      root = convention.pages.find_by(slug: 'root')
      assert root
      convention.root_page.must_equal root
    end

    it 'loads partials' do
      assert convention.cms_partials.find_by(name: 'news')
    end

    it 'loads layouts' do
      default_layout = convention.cms_layouts.find_by(name: 'Default')
      assert default_layout
      assert_equal default_layout, convention.default_layout
    end

    it 'loads user con profile form' do
      assert convention.user_con_profile_form, 'user_con_profile_form is missing'
    end
  end

  it 'validates that the content set exists' do
    result = LoadCmsContentSetService.new(convention: convention, content_set_name: 'nonexistent').call

    assert result.failure?
    result.errors.full_messages.join("\n").must_match /No content set found/
  end

  it 'is invalid if a root page already exists' do
    convention.create_root_page!(name: 'something_other_than_root', content: 'rooty toot')
    result = service.call

    assert result.failure?
    result.errors.full_messages.join("\n").must_match /already has a root page/
  end

  it 'is invalid if a default layout already exists' do
    convention.create_default_layout!(name: 'something_other_than_default', content: '{{ content_for_layout }}')
    result = service.call

    assert result.failure?
    result.errors.full_messages.join("\n").must_match /already has a default layout/
  end

  it 'is invalid if a page with the same name exists' do
    convention.pages.create!(name: 'root', content: 'rooty toot')
    result = service.call

    assert result.failure?
    result.errors.full_messages.join("\n").must_match /page named root already exists/
  end

  it 'is invalid if a partial with the same name exists' do
    convention.cms_partials.create!(name: 'news', content: 'No news is good news')
    result = service.call

    assert result.failure?
    result.errors.full_messages.join("\n").must_match /partial named news already exists/
  end

  it 'is invalid if a layout with the same name exists' do
    convention.cms_layouts.create!(name: 'Default', content: '{{ content_for_layout }}<p>Wow that was some boring content</p>')
    result = service.call

    assert result.failure?
    result.errors.full_messages.join("\n").must_match /layout named Default already exists/
  end

  it 'is invalid if user_con_profile_form already exists' do
    convention.create_user_con_profile_form!(
      title: 'user con profile form', convention: convention, form_type: 'user_con_profile'
    )

    result = service.call

    assert result.failure?
    assert_match(/already has a user_con_profile form/, result.errors.full_messages.join("\n"))
  end
end
