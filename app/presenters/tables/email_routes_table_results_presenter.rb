class Tables::EmailRoutesTableResultsPresenter < Tables::TableResultsPresenter
  field :receiver_address, 'Receiver address' do
    ilike_column_filter :receiver_address
  end

  field :forward_addresses, 'Forward addresses' do
    def apply_filter(scope, value)
      scope.where("lower(array_to_string(forward_addresses, ',')) like ?", "%#{value.downcase}%")
    end

    def sql_order(direction)
      Arel.sql("lower(array_to_string(forward_addresses, ',')) #{direction}")
    end
  end
end
