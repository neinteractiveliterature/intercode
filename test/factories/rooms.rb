# == Schema Information
#
# Table name: rooms
#
#  id            :integer          not null, primary key
#  name          :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  convention_id :integer
#
# Indexes
#
#  index_rooms_on_convention_id  (convention_id)
#
# Foreign Keys
#
#  fk_rails_...  (convention_id => conventions.id)
#

FactoryBot.define do
  factory :room do
    association(:convention)
    name { 'MyString' }
  end
end
