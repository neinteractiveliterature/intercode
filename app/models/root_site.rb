# frozen_string_literal: true
# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: root_sites
#
#  id                   :bigint           not null, primary key
#  cms_content_set_name :text             not null
#  disable_captcha      :boolean          default(FALSE), not null
#  site_name            :text
#  default_layout_id    :bigint
#  root_page_id         :bigint
#
# Indexes
#
#  index_root_sites_on_default_layout_id  (default_layout_id)
#  index_root_sites_on_root_page_id       (root_page_id)
#
# Foreign Keys
#
#  fk_rails_...  (default_layout_id => cms_layouts.id)
#  fk_rails_...  (root_page_id => pages.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective

class RootSite < ApplicationRecord
  belongs_to :root_page, class_name: "Page"
  belongs_to :default_layout, class_name: "CmsLayout"

  def self.instance
    RootSite.first
  end

  def pages
    Page.global
  end

  def cms_content_groups
    CmsContentGroup.global
  end

  def cms_layouts
    CmsLayout.global
  end

  def cms_partials
    CmsPartial.global
  end

  def cms_variables
    CmsVariable.global
  end

  def cms_files
    CmsFile.global
  end

  def cms_navigation_items
    CmsNavigationItem.global
  end

  def cms_graphql_queries
    CmsGraphqlQuery.global
  end

  def notification_templates
    NotificationTemplate.none
  end

  def forms
    Form.none
  end

  def host
    Rails.application.config.action_mailer.default_url_options[:host]
  end

  def url
    Rails.application.routes.url_helpers.root_url(Rails.application.config.action_mailer.default_url_options)
  end
end
