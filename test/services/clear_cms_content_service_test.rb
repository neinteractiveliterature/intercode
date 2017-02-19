require 'test_helper'

describe ClearCmsContentService do
  let(:convention) { FactoryGirl.create(:convention) }
  let(:service) { ClearCmsContentService.new(convention: convention) }

  before do
    convention.update!(root_page: FactoryGirl.build(:page, parent: convention))
    FactoryGirl.create(:page, parent: convention)
    FactoryGirl.create(:cms_partial, convention: convention)
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
      convention.pages.count.must_equal 0
    end

    it 'destroys all partials' do
      convention.cms_partials.count.must_equal 0
    end
  end
end