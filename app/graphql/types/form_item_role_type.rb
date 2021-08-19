class Types::FormItemRoleType < Types::BaseEnum
  FormItem::ROLE_VALUES.each do |possible_value|
    value possible_value
  end
end
