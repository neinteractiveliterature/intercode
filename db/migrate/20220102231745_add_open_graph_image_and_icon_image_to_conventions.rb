class AddOpenGraphImageAndIconImageToConventions < ActiveRecord::Migration[7.0]
  def change
    add_column :conventions, :open_graph_image, :text
    add_column :conventions, :favicon, :text
  end
end
