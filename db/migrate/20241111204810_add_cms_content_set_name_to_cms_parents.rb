class AddCmsContentSetNameToCmsParents < ActiveRecord::Migration[7.2]
  def change
    add_column :conventions, :cms_content_set_name, :text
    add_column :root_sites, :cms_content_set_name, :text

    reversible do |dir|
      dir.up do
        RootSite.update_all(cms_content_set_name: "root_site")

        Convention.reset_column_information
        Convention.find_each do |convention|
          cms_content_set_name =
            if convention.name.start_with?("Intercon ")
              if convention.cms_partials.where(name: "user_signup").any?
                "wanderlust"
              elsif convention.cms_partials.where(name: "badgecheck").any?
                "smoke_and_mirrors"
              else
                "standard"
              end
            else
              "standard"
            end

          convention.update!(cms_content_set_name:)
        end
      end
    end

    change_column_null :conventions, :cms_content_set_name, false
    change_column_null :root_sites, :cms_content_set_name, false
  end
end
