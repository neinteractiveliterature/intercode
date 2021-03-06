class BundleHashController < ApplicationController
  skip_before_action :ensure_assumed_identity_matches_convention
  skip_before_action :ensure_user_con_profile_exists
  skip_before_action :redirect_if_user_con_profile_needs_update
  skip_before_action :ensure_clickwrap_agreement_accepted

  class << self
    attr_accessor :bundle_hash_value
  end

  def show
    render plain: bundle_hash
  end

  private

  def bundle_hash
    self.class.bundle_hash_value ||= begin
      if Rails.env.development?
        'dev_server'
      else
        Digest::MD5.hexdigest(File.read(Rails.root.join('public/packs/assets-manifest.json')))
      end
    end
  end
end
