require 'spec_helper'

describe User do

  before(:each) do
    @attr = {
      :first_name => 'Example',
      :last_name => 'Name',
      :email => 'user@example.com',
      :password => 'changeme',
      :password_confirmation => 'changeme'
    }
  end

  it 'should create a new instance given a valid attribute' do
    User.create!(@attr)
  end

  describe 'email addresses' do
    it 'should require an email address' do
      no_email_user = User.new(@attr.merge(:email => ''))
      expect(no_email_user).not_to be_valid
    end

    it 'should reject invalid email addresses' do
      addresses = %w[user@foo,com user_at_foo.org example.user@foo.]
      addresses.each do |address|
        invalid_email_user = User.new(@attr.merge(:email => address))
        expect(invalid_email_user).not_to be_valid
      end
    end

    it 'should reject duplicate email addresses' do
      User.create!(@attr)
      user_with_duplicate_email = User.new(@attr)
      expect(user_with_duplicate_email).not_to be_valid
    end

    it 'should reject email addresses identical up to case' do
      upcased_email = @attr[:email].upcase
      User.create!(@attr.merge(:email => upcased_email))
      user_with_duplicate_email = User.new(@attr)
      expect(user_with_duplicate_email).not_to be_valid
    end
  end

  describe 'passwords' do

    before(:each) do
      @user = User.new(@attr)
    end

    it 'should have a password attribute' do
      expect(@user).to respond_to(:password)
    end

    it 'should have a password confirmation attribute' do
      expect(@user).to respond_to(:password_confirmation)
    end
  end

  describe 'password validations' do

    it 'should require a password' do
      blank_password = User.new(@attr.merge(:password => '', :password_confirmation=> ''))
      expect(blank_password).not_to be_valid
    end

    it 'should require a matching password confirmation' do
      matching_confirmation = User.new(@attr.merge(:password_confirmation => 'invalid'))
      expect(matching_confirmation).not_to be_valid
    end

    it 'should reject short passwords' do
      short = "a" * 5
      hash = @attr.merge(:password => short, :password_confirmation => short)
      shortpassword = User.new(hash)
      expect(shortpassword).to_not be_valid
    end

  end

  describe 'password encryption' do

    before(:each) do
      @user = User.create!(@attr)
    end

    it 'should have an encrypted password attribute' do
      expect(@user).to respond_to(:encrypted_password)
    end

    it 'should set the encrypted password attribute' do
      expect(@user.encrypted_password).not_to be_blank
    end

  end

  describe 'nickname' do

    it 'should allow blanks' do
      no_nickname = User.new(@attr.merge(:nickname => ''))
      expect(no_nickname).to be_valid
    end

    it 'should allow short text' do
      short_nickname = 'a' * 30
      user_nickname = User.new(@attr.merge(:nickname => short_nickname))
      expect(user_nickname).to be_valid
    end

    it 'should not allow long text' do
      long_nickname = 'a' * 100
      user_long_nickname = User.new(@attr.merge(:nickname => long_nickname))
      expect(user_long_nickname).not_to be_valid
    end

  end

  describe 'phone' do

    it 'should allow blanks' do
      no_phone = User.new(@attr.merge(:nickname => ''))
      expect(no_phone).to be_valid
    end


    it 'should reject text' do
      text_phone = 'a' * 5
      user_text_phone = User.new(@attr.merge(:phone => text_phone))
      expect(user_text_phone).not_to be_valid
    end

    it 'should accept variety of phone types' do
      phones = ['1-234-567-8901', '1 234 567 8901', '1 (234) 567-8901', '1.234.567.8901', '12345678901']

      phones.each do |phone|
        phone_user = User.new(@attr.merge(:phone => phone))
        expect(phone_user).to be_valid
      end

    end

  end

  describe 'default gender' do

    it 'should reject free text' do
      string = 'a' * 5
      user_string_gender = User.new(@attr.merge(:default_gender => string))
      expect(user_string_gender).not_to be_valid
    end

    it 'should accept valid default genders' do
      genders = %w(female male either)

      genders.each do |gender|
        gender_user = User.new(@attr.merge(:default_gender => gender))
        expect(gender_user).to be_valid
      end

    end

  end

end
