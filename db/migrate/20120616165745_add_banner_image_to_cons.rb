class AddBannerImageToCons < ActiveRecord::Migration
  def change
    add_column :cons, :banner_image, :string
  end
end
