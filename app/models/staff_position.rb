# frozen_string_literal: true
# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: staff_positions
#
#  id            :bigint           not null, primary key
#  cc_addresses  :text             default([]), not null, is an Array
#  email         :text
#  email_aliases :text             default([]), not null, is an Array
#  name          :text
#  visible       :boolean
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  convention_id :bigint
#
# Indexes
#
#  index_staff_positions_on_convention_id  (convention_id)
#  index_staff_positions_on_visible        (visible)
#
# Foreign Keys
#
#  fk_rails_...  (convention_id => conventions.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective

class StaffPosition < ApplicationRecord
  belongs_to :convention
  has_and_belongs_to_many :user_con_profiles
  has_many :permissions, dependent: :destroy
  has_one :catch_all_convention,
          class_name: 'Convention',
          foreign_key: 'catch_all_staff_position_id',
          dependent: :nullify

  validates :name, presence: true

  scope :visible, -> { where(visible: true) }

  def to_liquid
    StaffPositionDrop.new(self)
  end
end
