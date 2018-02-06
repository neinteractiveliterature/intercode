class Intercode::Import::Intercode1::NavigationItems
  NAVIGATION_STRUCTURE = [
    {
      type: :section,
      title: 'About',
      links: [
        { type: :link, title: 'About Intercon', page_name: 'about' },
        { type: :link, title: 'Convention Rules', page_name: 'ConRules' },
        { type: :link, title: 'What Does It Cost?', page_name: 'Cost' },
        { type: :link, title: 'Contacts', page_name: 'Contacts' },
        { type: :link, title: 'Hotel Info', page_name: 'hotel' },
        { type: :link, title: 'Who\'s Who', page_name: 'Who\'s Who' },
        { type: :link, title: 'Volunteering', page_name: 'volunteering' },
        { type: :link, title: 'ConCom Schedule', page_name: 'ConCom Schedule' },
        { type: :link, title: 'Intercon Flyer', page_name: 'Flyer' },
        { type: :link, title: 'Intercon Program', page_name: 'Program' }
      ]
    }
  ]

  attr_reader :convention

  def initialize(convention)
    @convention = convention
  end

  def import!
    logger.info 'Importing navigation items'

    NAVIGATION_STRUCTURE.each do |item|
      import_navigation_item(item)
    end
  end

  private

  def logger
    Intercode::Import::Intercode1.logger
  end

  def import_navigation_item(item)
    case item[:type]
    when :section then import_navigation_section(item)
    when :link then import_navigation_link(item, nil)
    else raise "Unknown navigation item type #{item[:type].inspect}"
    end
  end

  def import_navigation_section(item)
    logger.info("Creating navigation section #{item[:title]}")
    section = convention.cms_navigation_items.create!(title: item[:title])
    item[:links].each do |link|
      import_navigation_link(link, section)
    end
  end

  def import_navigation_link(item, navigation_section)
    page = convention.pages.find_by(name: item[:page_name])
    if page
      logger.info("Creating navigation link #{item[:title]}")
      convention.cms_navigation_items.create!(
        title: item[:title],
        page: page,
        navigation_section: navigation_section
      )
    else
      logger.info("Not creating navigation link #{item[:title]} because \
there is no page called #{item[:page_name]}")
    end
  end
end
