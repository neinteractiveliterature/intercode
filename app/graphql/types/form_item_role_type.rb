# frozen_string_literal: true
class Types::FormItemRoleType < Types::BaseEnum
  FormItem::ROLE_VALUES.each { |possible_value| value possible_value }
end
