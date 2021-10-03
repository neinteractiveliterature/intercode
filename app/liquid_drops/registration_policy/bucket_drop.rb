# frozen_string_literal: true
# A registration bucket for an event
class RegistrationPolicy::BucketDrop < Liquid::Drop
  # @api
  attr_reader :bucket

  # @!method key
  #   @return [String] The unique string identifier for this bucket
  # @!method name
  #   @return [String] The name of this bucket
  # @!method description
  #   @return [String] A long-form description for the bucket (currently not exposed anywhere)
  # @!method minimum_slots
  #   @return [Integer] The minimum number of attendees needed for this bucket
  # @!method preferred_slots
  #   @return [Integer] The preferred number of attendees for this bucket
  # @!method total_slots
  #   @return [Integer] The maximum number of attendees this bucket can accept
  # @!method slots_limited
  #   @return [Boolean] Whether or not the number of attendees is limited in this bucket
  # @!method anything
  #   @return [Boolean] Whether or not this is a "flex" bucket ("anything" is a legacy term for
  #                     "flex")
  # @!method not_counted
  #   @return [Boolean] If true, attendees in this bucket are not counted towards total attendees
  #                     for runs of this event, and this event will not count towards their maximum
  #                     event signups allowed
  # @!method expose_attendees
  #   @return [Boolean] Whether or not to allow other attendees to see that a person is in this
  #                     bucket in the signup summary page
  delegate :key,
           :name,
           :description,
           :minimum_slots,
           :preferred_slots,
           :total_slots,
           :slots_limited,
           :anything,
           :not_counted,
           :expose_attendees,
           to: :bucket

  # @api
  def initialize(bucket)
    @bucket = bucket
  end
end
