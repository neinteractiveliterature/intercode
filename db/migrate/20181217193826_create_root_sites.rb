class CreateRootSites < ActiveRecord::Migration[5.2]
  ROOT_PAGE_CONTENT = <<~LIQUID
    {% assign conventions_sorted = conventions | sort:'starts_at' | reverse %}
    {% assign now = "now" | date: "%Y-%m-%d %H:%M" %}

    <h1>Upcoming conventions</h1>
    <ul class="list-group">
      {% for convention in conventions_sorted %}
        {% if now < convention.ends_at %}
          <li class="list-group-item">
            <a href="{{ convention.url }}">{{ convention.name }}</a>
          </li>
        {% endif %}
      {% endfor %}
    </ul>

    <h1>Past conventions</h1>
    <ul class="list-group">
      {% for convention in conventions_sorted %}
        {% if now > convention.ends_at %}
          <li class="list-group-item">
            <a href="{{ convention.url }}">{{ convention.name }}</a>
          </li>
        {% endif %}
      {% endfor %}
    </ul>
  LIQUID

  def change
    create_table :root_sites do |t|
      t.text :site_name
      t.references :root_page, foreign_key: { to_table: :pages }
      t.references :default_layout, foreign_key: { to_table: :cms_layouts }
    end

    reversible do |dir|
      dir.up do
        PgSearch.disable_multisearch do
          [Page, CmsLayout].each(&:reset_column_information)

          root_page = Page.find_or_create_by!(parent_id: nil, parent_type: nil, slug: 'root') do |p|
            p.name = 'Main page'
            p.content = ROOT_PAGE_CONTENT
          end

          default_layout_path = File.expand_path(
            'cms_content_sets/standard/layouts/Default.liquid',
            Rails.root
          )

          default_layout_content = File.open(default_layout_path, 'r') { |f| f.read }

          default_layout = CmsLayout.find_or_create_by!(parent_id: nil, parent_type: 'nil', name: 'Default') do |layout|
            layout.content = default_layout_content
          end

          RootSite.create!(site_name: 'Intercode', root_page: root_page, default_layout: default_layout)
        end
      end
    end
  end
end
