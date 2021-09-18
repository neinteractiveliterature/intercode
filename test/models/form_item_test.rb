# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: form_items
#
#  id                 :bigint           not null, primary key
#  admin_description  :text
#  default_value      :jsonb
#  identifier         :text
#  item_type          :text
#  position           :integer          not null
#  properties         :jsonb
#  public_description :text
#  visibility         :string           default("normal"), not null
#  writeability       :string           default("normal"), not null
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  form_section_id    :bigint
#
# Indexes
#
#  index_form_items_on_form_section_id  (form_section_id)
#
# Foreign Keys
#
#  fk_rails_...  (form_section_id => form_sections.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective
require 'test_helper'

class FormItemTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
