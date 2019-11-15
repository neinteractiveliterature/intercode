require 'test_helper'

describe ClearCmsContentService do
  let(:convention) { create(:convention) }
  let(:service) { ClearCmsContentService.new(convention: convention) }

  before do
    convention.update!(root_page: build(:page, parent: convention))
    create(:page, parent: convention)
    create(:cms_partial, parent: convention)
  end

  describe 'successfully running' do
    before do
      @result = service.call
    end

    it 'returns a successful result' do
      assert @result.success?
    end

    it 'destroys the root page' do
      convention.root_page.must_be_nil
    end

    it 'destroys all pages' do
      assert_equal 0, convention.pages.count
    end

    it 'destroys all partials' do
      assert_equal 0, convention.cms_partials.count
    end
  end
end
