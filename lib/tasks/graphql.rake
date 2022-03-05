require 'graphql/rake_task'
GraphQL::RakeTask.new(schema_name: 'IntercodeSchema')

namespace :graphql do
  desc 'Dump GraphQL schema and run graphql-codegen'
  task update: 'graphql:schema:dump' do
    Process.exec('yarn run graphql:codegen')
  end
end
