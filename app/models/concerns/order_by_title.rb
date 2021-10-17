# frozen_string_literal: true
module OrderByTitle
  extend ActiveSupport::Concern

  included { scope :order_by_title, ->(direction = nil) { order(Arel.sql(<<~SQL.squish)) } }
        regexp_replace(
          regexp_replace(
            trim(regexp_replace(unaccent(#{table_name}.title), '[^0-9a-z ]', '', 'gi')),
            '^(the|a|an) +',
            '',
            'i'
          ),
          ' ',
          '',
          'g'
        ) #{direction}
      SQL
end
