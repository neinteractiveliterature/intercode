# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: cms_files
#
#  id          :integer          not null, primary key
#  parent_type :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  parent_id   :integer
#  uploader_id :bigint
#
# Indexes
#
#  index_cms_files_on_parent_id    (parent_id)
#  index_cms_files_on_uploader_id  (uploader_id)
#
# Foreign Keys
#
#  fk_rails_...  (uploader_id => users.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective
FactoryBot.define do
  factory :cms_file do
    file { Rack::Test::UploadedFile.new(File.expand_path('test/files/war_bond.png', Rails.root), 'image/png') }
    association :parent, factory: :convention
    association :uploader, factory: :user
  end
end
