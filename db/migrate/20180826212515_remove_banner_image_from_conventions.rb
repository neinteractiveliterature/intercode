class RemoveBannerImageFromConventions < ActiveRecord::Migration[5.2]
  def change
    remove_column :conventions, :banner_image, :string
  end
end
