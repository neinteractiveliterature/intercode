class Mutations::UpdateRootSite < Mutations::BaseMutation
  field :root_site, Types::RootSiteType, null: false, camelize: false

  argument :root_site, Types::RootSiteInputType, required: true, camelize: false

  attr_reader :root_site_instance

  define_authorization_check do |_args|
    @root_site_instance = RootSite.instance
    policy(root_site_instance).update?
  end

  def resolve(root_site:)
    root_site_instance.update!(root_site.to_h)
    { root_site: root_site_instance }
  end
end
