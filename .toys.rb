tool 'update_schema' do
  desc 'Regenerate the GraphQL schema and documentation'
  include :exec, exit_on_nonzero_status: true

  def run
    sh 'bin/rake graphql:schema:dump'
    FileUtils.rm_r('./docs/schema', secure: true)
    sh 'yarn run graphdoc:generate'
  end
end

tool 'pull_production_db' do
  desc 'Pull down the production database into development'
  include :exec, exit_on_nonzero_status: true

  def run
    sh 'bin/pull_production_database'
  end
end
