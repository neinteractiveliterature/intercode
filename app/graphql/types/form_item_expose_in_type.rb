# frozen_string_literal: true
class Types::FormItemExposeInType < Types::BaseEnum
  FormItem::EXPOSE_IN_VALUES.each { |possible_value| value possible_value }
end
