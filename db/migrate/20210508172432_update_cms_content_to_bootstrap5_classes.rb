# rubocop:disable Style/WordArray

class UpdateCmsContentToBootstrap5Classes < ActiveRecord::Migration[6.1]
  CMS_CONTENT_COLUMNS = {
    pages: 'content',
    cms_partials: 'content',
    cms_layouts: 'content'
  }

  UP_REGEXP_REPLACEMENTS = [
    ['(?<=\\W)ml-(\\d)(?=\\W)', 'ms-\\1'],
    ['(?<=\\W)mr-(\\d)(?=\\W)', 'me-\\1'],
    ['(?<=\\W)pl-(\\d)(?=\\W)', 'ps-\\1'],
    ['(?<=\\W)pr-(\\d)(?=\\W)', 'pe-\\1'],

    # Bootstrap 5 doesn't have a media class anymore but leaving it in here will make it easier
    # to back this out if we need to
    ['class="media(?!-body)', 'class="media d-flex align-items-start'],

    ['float-left', 'float-start'],
    ['float-right', 'float-end'],
    ['text-left', 'text-start'],
    ['text-right', 'text-end'],

    ['data-toggle=', 'data-bs-toggle='],
    ['data-target=', 'data-bs-target='],
    ['data-placement=', 'data-bs-placement=']
  ]

  DOWN_REGEXP_REPLACEMENTS = [
    ['(?<=\\W)ms-(\\d)(?=\\W)', 'ml-\\1'],
    ['(?<=\\W)me-(\\d)(?=\\W)', 'mr-\\1'],
    ['(?<=\\W)ps-(\\d)(?=\\W)', 'pl-\\1'],
    ['(?<=\\W)pe-(\\d)(?=\\W)', 'pr-\\1'],
    ['class="media d-flex align-items-start', 'class="media'],
    ['float-start', 'float-left'],
    ['float-end', 'float-right'],
    ['text-start', 'text-left'],
    ['text-end', 'text-right'],
    ['data-bs-toggle=', 'data-toggle='],
    ['data-bs-target=', 'data-target='],
    ['data-bs-placement=', 'data-placement=']
  ]

  def up
    CMS_CONTENT_COLUMNS.each do |table_name, column_name|
      execute <<~SQL
        UPDATE #{quote_table_name(table_name)}
        SET #{quote_column_name(column_name)} = #{generate_nested_regexp_replace(column_name, UP_REGEXP_REPLACEMENTS)};
      SQL
    end
  end

  def down
    CMS_CONTENT_COLUMNS.each do |table_name, column_name|
      execute <<~SQL
        UPDATE #{quote_table_name(table_name)}
        SET #{quote_column_name(column_name)} = #{generate_nested_regexp_replace(column_name, DOWN_REGEXP_REPLACEMENTS)};
      SQL
    end
  end

  private

  def generate_nested_regexp_replace(column_name, replacements)
    replacements.inject(quote_column_name(column_name)) do |sql, (pattern, replacement)|
      <<~SQL
        regexp_replace(#{sql}, #{quote(pattern)}, #{quote(replacement)}, 'g')
      SQL
    end
  end
end
