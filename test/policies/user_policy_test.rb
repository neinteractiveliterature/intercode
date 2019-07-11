require 'test_helper'
require_relative 'organization_role_test_helper'

class UserPolicyTest < ActiveSupport::TestCase
  include OrganizationRoleTestHelper

  let(:subject_profile) { create(:user_con_profile) }
  let(:subject_user) { subject_profile.user }
  let(:convention) { subject_profile.convention }
  let(:organization) { create(:organization, conventions: [convention]) }

  describe '#read?' do
    it 'lets site admins read users' do
      user = create(:user, site_admin: true)
      assert UserPolicy.new(user, subject_user).read?
    end

    it 'lets users with read_convention_users permission read' do
      user = create_reading_user_in_organization(organization)
      assert UserPolicy.new(user, subject_user).read?
    end

    it 'lets users read themselves' do
      assert UserPolicy.new(subject_user, subject_user).read?
    end

    it 'does not let any other users read' do
      user = create(:user)
      refute UserPolicy.new(user, subject_user).read?
    end
  end

  describe '#manage?' do
    it 'lets site admins manage users' do
      user = create(:user, site_admin: true)
      assert UserPolicy.new(user, subject_user).manage?
    end

    it 'does not let users with read_convention_users permission manage users' do
      user = create_reading_user_in_organization(organization)
      refute UserPolicy.new(user, subject_user).manage?
    end

    it 'does not let users manage themselves' do
      refute UserPolicy.new(subject_user, subject_user).manage?
    end

    it 'does not let any other users manage' do
      user = create(:user)
      refute UserPolicy.new(user, subject_user).manage?
    end
  end

  describe '#update?' do
    it 'lets site admins update users' do
      user = create(:user, site_admin: true)
      assert UserPolicy.new(user, subject_user).update?
    end

    it 'does not let users with read_convention_users permission update users' do
      user = create_reading_user_in_organization(organization)
      refute UserPolicy.new(user, subject_user).update?
    end

    it 'lets users update themselves' do
      assert UserPolicy.new(subject_user, subject_user).update?
    end

    it 'does not let any other users update users' do
      user = create(:user)
      refute UserPolicy.new(user, subject_user).update?
    end
  end

  describe '#merge?' do
    it 'lets site admins merge users' do
      user = create(:user, site_admin: true)
      assert UserPolicy.new(user, subject_user).merge?
    end

    it 'does not let users with read_convention_users permission merge users' do
      user = create_reading_user_in_organization(organization)
      refute UserPolicy.new(user, subject_user).merge?
    end

    it 'does not let users merge themselves' do
      refute UserPolicy.new(subject_user, subject_user).merge?
    end

    it 'does not let any other users merge users' do
      user = create(:user)
      refute UserPolicy.new(user, subject_user).merge?
    end
  end

  describe 'Scope' do
    it 'returns all users for site admins' do
      user = create(:user, site_admin: true)
      resolved_users = UserPolicy::Scope.new(user, User.all).resolve

      assert_equal [user, subject_user].sort, resolved_users.sort
    end

    it 'returns all users in conventions where you have the read_convention_users permission' do
      user = create_reading_user_in_organization(organization)
      create(:user) # another user we won't return
      resolved_users = UserPolicy::Scope.new(user, User.all).resolve

      assert_equal [subject_user, user].sort, resolved_users.sort
    end

    it 'returns just yourself for other users' do
      user = create(:user)
      subject_user
      resolved_users = UserPolicy::Scope.new(user, User.all).resolve

      assert_equal [user], resolved_users.sort
    end
  end
end
