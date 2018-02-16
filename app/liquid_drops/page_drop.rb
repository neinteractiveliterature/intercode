class PageDrop < Liquid::Drop
  attr_reader :page
  delegate :name, :slug, to: :page

  def initialize(page)
    @page = page
  end
end
