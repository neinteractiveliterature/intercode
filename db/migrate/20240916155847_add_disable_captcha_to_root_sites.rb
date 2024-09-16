class AddDisableCaptchaToRootSites < ActiveRecord::Migration[7.2]
  def change
    add_column :root_sites, :disable_captcha, :boolean, null: false, default: false
  end
end
