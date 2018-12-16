class CreateCmsGraphqlQueries < ActiveRecord::Migration[5.2]
  def change
    create_table :cms_graphql_queries do |t|
      t.references :parent, polymorphic: true
      t.text :identifier
      t.text :admin_notes
      t.text :query

      t.timestamps
    end
  end
end
