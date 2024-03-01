# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: redirect_urls
#
#  id          :bigint           not null, primary key
#  destination :text
#  path        :text             not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  domain_id   :bigint           not null
#
# Indexes
#
#  index_redirect_urls_on_domain_id           (domain_id)
#  index_redirect_urls_on_domain_id_and_path  (domain_id,path) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (domain_id => domains.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective
class RedirectUrl < ApplicationRecord
  belongs_to :domain
end
