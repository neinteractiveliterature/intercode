Types::ShowScheduleType = GraphQL::EnumType.define do
  name 'ShowSchedule'

  value('no')
  value('priv')
  value('gms')
  value('yes')
end
