require 'tmpdir'

tool 'update_schema' do
  desc 'Regenerate the GraphQL schema and documentation'

  include :exec, exit_on_nonzero_status: true
  flag :publish

  def run
    sh 'bin/rake graphql:schema:dump'
    sh 'yarn run graphql:build_type_data'
    sh 'yarn run graphql:codegen'

    return unless publish
    Dir.mktmpdir do |dir|
      sh "git clone --depth 1 -b gh-pages $(git remote get-url origin) #{dir}"

      dest_dir = File.expand_path('schema', dir)
      FileUtils.rm_rf(dest_dir) if File.exist?(dest_dir)
      sh "yarn run graphqldoc:generate -o #{dest_dir}"

      Dir.chdir(dir) do
        sh 'git add --all .'
        sh "git commit -m 'Schema docs update'"
        sh 'git push'
      end
    end
  end
end

tool 'pull_production_db' do
  desc 'Pull down the production database into development'
  include :exec, exit_on_nonzero_status: true
  flag :docker_compose
  flag :include_form_response_changes

  def run
    puts 'Getting database URL from Heroku'
    database_url = capture('heroku config:get DATABASE_URL')

    puts 'Pulling production data'
    pull_options = (
      include_form_response_changes ? '' : '--exclude-table-data="form_response_changes"'
    )
    sh "docker run -i -t --mount type=bind,source=\"#{Dir.pwd}\",target=/out postgres:12.2 \
pg_dump #{pull_options} -v -x --no-owner -Fp \"#{database_url}\" \
-f /out/intercode_production.sql"

    exec_tool("load_production_db #{docker_compose ? '--docker-compose' : ''}")
  end
end

tool 'load_production_db' do
  desc 'Load a production pgdump into development'
  include :exec, exit_on_nonzero_status: true
  flag :file, default: 'intercode_production.sql'
  flag :docker_compose

  def run
    if docker_compose
      sh "docker-compose -f docker-compose.yml -f docker-compose.load_production_database.yml \
run load_production_database bin/load_production_database #{file}"
    else
      sh "./bin/load_production_database #{file}"
    end
  end
end

tool 'build_sanitized_db' do
  desc 'Build a sanitized database from the existing dev database'
  include :exec, exit_on_nonzero_status: true

  def run
    puts 'Copying dev database for sanitization'
    sh 'dropdb -U postgres --if-exists intercode_sanitized_tmp'
    sh 'createdb -U postgres -T intercode_development intercode_sanitized_tmp'

    sh './bin/rails sanitize_db DEVELOPMENT_DATABASE_URL=postgres://postgres@localhost/intercode_sanitized_tmp'

    puts 'Creating pgdump file'
    sh "pg_dump -Fc -d intercode_sanitized_tmp -f intercode_sanitized_#{Time.now.strftime('%Y-%m-%d')}.pgdump"

    puts 'Dropping temporary database'
    sh 'dropdb -U postgres intercode_sanitized_tmp'
  end
end

tool 'pull_uploads' do
  desc 'Pull uploaded files down from production'
  include :bundler

  def run
    require_relative 'config/environment'

    CmsFile.find_each do |cms_file|
      file = cms_file.file
      dest_path = file.path
      next if File.exist?(dest_path)

      prod_url = URI("https://uploads.neilhosting.net/#{file.store_path}#{file.identifier}")
      puts "Downloading #{prod_url}"
      FileUtils.mkdir_p(File.dirname(dest_path))
      File.open(dest_path, 'wb') do |outfile|
        outfile.write(Net::HTTP.get(prod_url))
      end
    end
  end
end

tool 'cleanup_branches' do
  desc 'Clean up local branches that were deleted or merged in origin'
  include :exec, exit_on_nonzero_status: true

  def run
    sh 'git fetch origin --prune'
    sh 'git branch --merged | egrep -v "(^\*|main)" | xargs git branch -d'
  end
end

tool 'update_liquid_doc_json' do
  desc 'Generate a new liquid_doc.json by introspecting the Liquid code'

  def serialize_class(klass)
    {
      name: klass.path,
      superclasses: klass.inheritance_tree.map(&:path),
      docstring: klass.docstring,
      tags: klass.tags.map { |tag| serialize_tag(tag) },
      methods: klass.meths.map { |meth| serialize_method(meth) }
    }
  end

  def serialize_method(meth)
    {
      name: meth.name,
      docstring: meth.docstring,
      tags: meth.tags.map { |tag| serialize_tag(tag) }
    }
  end

  def serialize_tag(tag)
    {
      tag_name: tag.tag_name,
      name: tag.name,
      text: tag.text,
      types: tag.types
    }
  end

  def serialize_registry
    classes = YARD::Registry.all.select { |obj| obj.is_a?(YARD::CodeObjects::ClassObject) }
    filters_module = YARD::Registry.all.find do |obj|
      obj.is_a?(YARD::CodeObjects::ModuleObject) && obj.path == 'Intercode::Liquid::Filters'
    end

    {
      classes: classes.map { |klass| serialize_class(klass) },
      filter_methods: filters_module.meths
        .select { |meth| meth.visibility == :public }
        .map { |meth| serialize_method(meth) }
    }
  end

  def run
    require 'yard'
    require 'json'
    require 'pry'

    YARD::Tags::Library.define_tag('Liquid tag name', :liquid_tag_name)

    %w[
      app/liquid_drops/**/*.rb
      lib/intercode/liquid/**/*.rb
      app/models/cms_variable.rb
    ].each do |path|
      YARD.parse(path)
    end

    File.open('liquid_doc.json', 'w') do |file|
      file.write(JSON.pretty_generate(serialize_registry))
    end
  end
end

tool 'download_email' do
  desc 'Download and decrypt an email from the S3 inbox'
  required_arg :message_id

  def run
    require_relative 'config/environment'

    ENV['AWS_PROFILE'] = 'neil'
    ENV['AWS_REGION'] = 'us-east-1'
    message = ReceiveSnsEmailDeliveryService.s3_client.get_object(
      bucket: 'intercode-inbox',
      key: message_id
    ).body.read
    File.open("#{message_id}.eml", 'w') do |file|
      file.write message
    end
  end
end
