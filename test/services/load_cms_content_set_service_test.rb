require 'test_helper'

describe LoadCmsContentSetService do
  let(:convention) { FactoryGirl.create(:convention) }
  let(:service) { LoadCmsContentSetService.new(convention: convention, content_set_name: 'standard') }

  describe 'successfully loading content' do
    before do
      @result = service.call
    end

    it 'returns a success result' do
      assert @result.success?
    end

    it 'loads pages' do
      root = convention.pages.find_by(name: 'root')
      assert root
      convention.root_page.must_equal root
    end

    it 'loads partials' do
      assert convention.cms_partials.find_by(identifier: 'news')
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

  it 'is invalid if a page with the same name exists' do
    convention.pages.create!(name: 'root', content: 'rooty toot')
    result = service.call

    assert result.failure?
    result.errors.full_messages.join("\n").must_match /page named root already exists/
  end

  it 'is invalid if a partial with the same name exists' do
    convention.cms_partials.create!(identifier: 'news', content: 'No news is good news')
    result = service.call

    assert result.failure?
    result.errors.full_messages.join("\n").must_match /partial named news already exists/
  end
end