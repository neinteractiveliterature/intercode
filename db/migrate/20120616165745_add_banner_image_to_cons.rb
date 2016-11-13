class AddBannerImageToCons < ActiveRecord::Migration[4.2]
  def change
    add_column :cons, :banner_image, :string
  end
end
