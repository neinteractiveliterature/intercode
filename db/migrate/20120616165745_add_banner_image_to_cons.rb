class AddBannerImageToCons < ActiveRecord::Migration[5.1]
  def change
    add_column :cons, :banner_image, :string
  end
end
