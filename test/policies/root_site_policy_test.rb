require 'test_helper'

class RootSitePolicyTest < ActiveSupport::TestCase
  let(:root_site) { create(:root_site) }

  describe '#read?' do
    it 'lets anyone read the root site' do
      assert RootSitePolicy.new(nil, root_site).read?
    end
  end

  describe '#manage?' do
    it 'lets site admins manage the root site' do
      user = create(:user, site_admin: true)
      assert RootSitePolicy.new(user, root_site).manage?
    end

    it 'does not let non-admins manage the root site' do
      user = create(:user)
      refute RootSitePolicy.new(user, root_site).manage?
    end
  end

  describe 'Scope' do
    it 'returns the root site' do
      resolved_root_sites = RootSitePolicy::Scope.new(nil, RootSite.all).resolve
      assert_equal [root_site], resolved_root_sites.sort
    end
  end
end
