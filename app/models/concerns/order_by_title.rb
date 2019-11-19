module OrderByTitle
  extend ActiveSupport::Concern

  included do
    scope :order_by_title, ->(direction = nil) do
      order(Arel.sql(<<~SQL))
        regexp_replace(
          regexp_replace(
            trim(regexp_replace(unaccent(events.title), '[^0-9a-z ]', '', 'gi')),
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
  end
end
