class ConvertIconsToBootstrap < ActiveRecord::Migration[6.1]
  CMS_CONTENT_COLUMNS = {
    pages: 'content',
    cms_partials: 'content',
    cms_layouts: 'content'
  }

  ICON_MAP = {
    'address-card': 'card-heading',
    'arrow-circle-left': 'arrow-left-circle-fill',
    'arrow-circle-right': 'arrow-right-circle-fill',
    'asterisk': 'asterisk',
    'bars': 'list',
    'building': 'building',
    'calendar': 'calendar3',
    'calendar-o': 'calendar',
    'calendar-check-o': 'calendar2-check',
    'calendar-plus-o': 'calendar-plus',
    'caret-down': 'caret-down-fill',
    'caret-right': 'caret-right-fill',
    'cc-stripe': 'credit-card',
    'check': 'check',
    'check-square-o': 'check-square',
    'chevron-left': 'chevron-left',
    'chevron-right': 'chevron-right',
    'circle': 'circle-fill',
    'circle-o': 'circle',
    'circle-thin': 'circle',
    'clock-o': 'clock',
    'close': 'x',
    'code': 'code-slash',
    'cog': 'gear-fill',
    'cogs': 'gear-wide-connected',
    'columns': 'layout-split',
    'comments': 'chat-fill',
    'ellipsis-h': 'three-dots',
    'envelope': 'envelope-fill',
    'envelope-o': 'envelope',
    'exclamation-circle': 'exclamation-circle-fill',
    'exclamation-triangle': 'exclamation-triangle-fill',
    'external-link': 'box-arrow-up-right',
    'eye-slash': 'eye-slash',
    'file-audio-o': 'file-earmark-music',
    'file-excel-o': 'file-earmark-excel',
    'file-image-o': 'file-earmark-image',
    'file-o': 'file-earmark',
    'file-pdf-o': 'file-earmark-pdf',
    'file-powerpoint-o': 'file-earmark-ppt',
    'file-text': 'file-earmark-text-fill',
    'file-text-o': 'file-earmark-text',
    'file-video-o': 'file-earmark-play',
    'file-word-o': 'file-earmark-word',
    'file-zip-o': 'file-earmark-zip',
    'files-o': 'files',
    'folder': 'folder',
    'gavel': 'megaphone-fill',
    'gear': 'gear-fill',
    'gift': 'gift-fill',
    'group': 'people-fill',
    'google': 'google',
    'hourglass-half': 'hourglass-split',
    'lightbulb-o': 'lightbulb',
    'list': 'list-ul',
    'lock': 'lock-fill',
    'map': 'map-fill',
    'map-o': 'map',
    'map-marker': 'geo-alt-fill',
    'paperclip': 'paperclip',
    'paragraph': 'paragraph',
    'pause-circle': 'pause-circle-fill',
    'pencil': 'pencil-fill',
    'pencil-square-o': 'pencil-square',
    'plus': 'plus',
    'question-circle': 'question-circle-fill',
    'refresh': 'arrow-clockwise',
    'rocket': 'flag-fill', # we use this to represent "conventions", it's pretty arbitrary
    'star': 'star-fill',
    'star-o': 'star',
    'search': 'search',
    'shopping-bag': 'bag-fill',
    'shopping-cart': 'cart-fill',
    'sign-in': 'box-arrow-in-right',
    'sign-out': 'box-arrow-right',
    'square-o': 'square',
    'suitcase': 'briefcase-fill',
    'table': 'table',
    'tag': 'tag-fill',
    'tags': 'tags-fill',
    'ticket': 'person-badge-fill',
    'times': 'x',
    'times-rectangle': 'x-square-fill',
    'toggle-off': 'toggle-off',
    'toggle-on': 'toggle-on',
    'trash': 'trash-fill',
    'trash-o': 'trash',
    'university': 'bank2',
    'users': 'people-fill',
    'user-circle': 'person-circle',
    'user-circle-o': 'person-circle',
    'user-secret': 'lock-fill',
    'warning': 'exclamation-triangle-fill',
    'wrench': 'wrench'
  }

  def up
    replacements = ICON_MAP.map do |fa_icon, bi_icon|
      ["fa fa-#{fa_icon}", "bi-#{bi_icon}"]
    end

    CMS_CONTENT_COLUMNS.each do |table_name, column_name|
      execute <<~SQL
        UPDATE #{quote_table_name(table_name)}
        SET #{quote_column_name(column_name)} = #{generate_nested_regexp_replace(quote_column_name(column_name), replacements)};
      SQL
    end

    execute <<~SQL
      UPDATE form_items
      SET properties = properties || jsonb_build_object('caption', #{generate_nested_regexp_replace("properties->>'caption'", replacements)});
    SQL
  end

  def down
    replacements = ICON_MAP.map do |fa_icon, bi_icon|
      ["bi-#{bi_icon}", "fa fa-#{fa_icon}"]
    end

    CMS_CONTENT_COLUMNS.each do |table_name, column_name|
      execute <<~SQL
        UPDATE #{quote_table_name(table_name)}
        SET #{quote_column_name(column_name)} = #{generate_nested_regexp_replace(quote_column_name(column_name), replacements)};
      SQL
    end

    execute <<~SQL
      UPDATE form_items
      SET properties = properties || jsonb_build_object('caption', #{generate_nested_regexp_replace("properties->>'caption'", replacements)});
    SQL
  end

  private

  def generate_nested_regexp_replace(column_name, replacements)
    replacements.inject(column_name) do |sql, (pattern, replacement)|
      <<~SQL
        regexp_replace(#{sql}, #{quote(pattern)}, #{quote(replacement)}, 'g')
      SQL
    end
  end
end
