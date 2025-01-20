# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: forms
#
#  id            :bigint           not null, primary key
#  form_type     :string           not null
#  title         :text
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  convention_id :bigint
#
# Indexes
#
#  index_forms_on_convention_id  (convention_id)
#
# Foreign Keys
#
#  fk_rails_...  (convention_id => conventions.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective

require "test_helper"

class FormTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
