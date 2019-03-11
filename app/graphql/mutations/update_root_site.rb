class Mutations::UpdateRootSite < Mutations::BaseMutation
  field :root_site, Types::RootSiteType, null: false, camelize: false

  argument :root_site, Types::RootSiteInputType, required: true, camelize: false

  def resolve(root_site:)
    root_site_instance = RootSite.instance
    root_site_instance.update!(root_site.to_h)
    { root_site: root_site_instance }
  end
end
