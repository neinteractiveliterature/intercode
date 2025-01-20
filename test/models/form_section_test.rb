# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: form_sections
#
#  id         :bigint           not null, primary key
#  position   :integer          not null
#  title      :text
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  form_id    :bigint
#
# Indexes
#
#  index_form_sections_on_form_id  (form_id)
#
# Foreign Keys
#
#  fk_rails_...  (form_id => forms.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective

require 'test_helper'

class FormSectionTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
