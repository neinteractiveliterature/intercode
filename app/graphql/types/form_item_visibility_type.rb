class Types::FormItemVisibilityType < Types::BaseEnum
  FormItem::VISIBILITY_VALUES.each do |possible_value|
    value possible_value
  end
end
