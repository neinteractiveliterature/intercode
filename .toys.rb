require 'tmpdir'

tool 'update_schema' do
  desc 'Regenerate the GraphQL schema and documentation'

  include :exec, exit_on_nonzero_status: true
  flag :publish

  def run
    sh 'bin/rake graphql:schema:dump'

    return unless publish
    Dir.mktmpdir do |dir|
      sh "git clone --depth 1 -b gh-pages $(git remote get-url origin) #{dir}"

      dest_dir = File.expand_path('schema', dir)
      FileUtils.rm_rf(dest_dir) if File.exist?(dest_dir)
      sh "yarn run graphdoc:generate -o #{dest_dir}"

      Dir.chdir(dir) do
        sh "git commit -a -m 'Schema docs update'"
        sh 'git push'
      end
    end
  end
end

tool 'pull_production_db' do
  desc 'Pull down the production database into development'
  include :exec, exit_on_nonzero_status: true

  def run
    sh 'bin/pull_production_database'
  end
end
