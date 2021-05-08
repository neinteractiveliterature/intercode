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
    ['class="media', 'class="media d-flex align-items-start']
  ]

  DOWN_REGEXP_REPLACEMENTS = [
    ['(?<=\\W)ms-(\\d)(?=\\W)', 'ml-\\1'],
    ['(?<=\\W)me-(\\d)(?=\\W)', 'mr-\\1'],
    ['(?<=\\W)ps-(\\d)(?=\\W)', 'pl-\\1'],
    ['(?<=\\W)pe-(\\d)(?=\\W)', 'pr-\\1'],
    ['class="media d-flex align-items-start', 'class="media']
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
        regexp_replace(#{sql}, #{quote(pattern)}, #{quote(replacement)})
      SQL
    end
  end

  def generate_regexp_upgrade(column_name)
    <<~SQL
      regexp_replace(
        regexp_replace(
          regexp_replace(
            regexp_replace(
              #{quote_column_name(column_name)},
              '(?<=\\W)ml-(\\d)(?=\\W)', 'ms-\\1', 'g'
            ),
            '(?<=\\W)mr-(\\d)(?=\\W)', 'me-\\1', 'g'
          ),
          '(?<=\\W)pl-(\\d)(?=\\W)', 'ps-\\1', 'g'
        ),
        '(?<=\\W)pr-(\\d)(?=\\W)', 'pe-\\1', 'g'
      )
    SQL
  end

  def generate_regexp_downgrade(column_name)
    <<~SQL
      regexp_replace(
        regexp_replace(
          regexp_replace(
            regexp_replace(
              #{quote_column_name(column_name)},
              '(?<=\\W)ms-(\\d)(?=\\W)', 'ml-\\1', 'g'
            ),
            '(?<=\\W)me-(\\d)(?=\\W)', 'mr-\\1', 'g'
          ),
          '(?<=\\W)ps-(\\d)(?=\\W)', 'pl-\\1', 'g'
        ),
        '(?<=\\W)pe-(\\d)(?=\\W)', 'pr-\\1', 'g'
      )
    SQL
  end
end
