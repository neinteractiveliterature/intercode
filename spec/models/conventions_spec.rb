require 'spec_helper'
require File.expand_path('lib/domain_validator')

describe Convention do

  before(:each) do
    @attr = {
        :title => 'Example Convention',
        :domain => 'example.com'
    }
  end

  it 'should create a new instance given valid attributes' do
    good_convention = Convention.create!(@attr)
    expect(good_convention).to be_valid
  end

  describe 'domain' do

    it 'should reject an empty domain' do
      no_domain = Convention.new(@attr.merge(:domain => ''))
      expect(no_domain).not_to be_valid
    end

    it 'should reject invalid domains' do
      bad_domains = %w[foo foo,com /foo.com foo.com/testing http://foo.com]

      bad_domains.each do |domain|
        domain = Convention.new(@attr.merge(:domain => domain))
        expect(domain).not_to be_valid
      end

    end

    it 'should reject a full address domain' do
      full_domain = Convention.new(@attr.merge(:domain => 'http://example.com'))
      expect(full_domain).not_to be_valid
    end

    it 'should reject a duplicate domain' do
      Convention.create!(@attr)
      duplicate_domain = Convention.new(@attr)
      expect(duplicate_domain).not_to be_valid
    end

  end

    describe 'dates' do

      it 'should rejects single digits' do
        start_convention = Convention.new(@attr.merge(:start_date => '3'))
        expect(start_convention.start_date).to be_nil
        end_convention = Convention.new(@attr.merge(:end_date => '3'))
        expect(end_convention.end_date).to be_nil
      end


      it 'should reject text dates' do
        bad_date = 'not_a_date'

        start_convention = Convention.new(@attr.merge(:start_date => bad_date))
        expect(start_convention.start_date).to be_nil
        start_convention.update_attributes start_date: Date.today
        expect(start_convention.start_date).not_to be_nil

        end_convention = Convention.new(@attr.merge(:end_date => bad_date))
        expect(end_convention.end_date).to be_nil
        end_convention.update_attributes end_date: Date.today
        expect(end_convention.end_date).not_to be_nil

      end

      it 'should reject start_date after end_date' do
        timewarp_convention = Convention.new(@attr.merge(:start_date => Date.today, :end_date => Date.today - 1.day))
        expect(timewarp_convention).not_to be_valid
      end

      it 'should allow a convention with the same start and end dates' do
        same_day_convention = Convention.new(@attr.merge(:start_date => Date.today, :end_date => Date.today))
        expect(same_day_convention).to be_valid
      end

    end

end

