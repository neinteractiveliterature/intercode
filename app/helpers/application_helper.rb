module ApplicationHelper
  DEFAULT_NAVBAR_CLASSES = 'navbar-fixed-top navbar-expand-md mb-4 navbar-dark bg-intercode-blue'

  def self.obfuscated_email(address)
    address.gsub('.', ' DOT ').gsub('@', ' AT ')
  end

  def page_title
    parts = []

    parts << @page_title if @page_title.present?
    parts << @event.title if @event

    if @convention
      parts << @convention.name
    else
      parts << 'Intercode'
    end

    parts.join(' - ')
  end
end
