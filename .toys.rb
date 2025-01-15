require "tmpdir"

tool "setup_tls" do
  desc "Generate TLS key and certificate for local dev environment"

  include :exec, exit_on_nonzero_status: true
  flag :force_rebuild_ca

  def obtain_ca(force_rebuild) # rubocop:disable Metrics/MethodLength, Metrics/AbcSize
    if File.exist?("dev_ca.crt") && File.exist?("dev_ca.key") && !force_rebuild
      ca_key = OpenSSL::PKey::RSA.new(File.read("dev_ca.key"))
      ca_cert = OpenSSL::X509::Certificate.new(File.read("dev_ca.crt"))
      [ca_key, ca_cert]
    else
      ca_key = OpenSSL::PKey::RSA.generate(2048)

      ca_cert = OpenSSL::X509::Certificate.new
      ca_cert.version = 2
      ca_cert.serial = Time.now.to_i
      ca_cert.subject =
        OpenSSL::X509::Name.new(
          [
            ["O", "New England Interactive Literature"],
            %w[emailAddress webmaster@intercode.test],
            ["CN", "Intercode development CA"]
          ]
        )
      ca_cert.issuer = ca_cert.subject
      ca_cert.public_key = ca_key.public_key
      ca_cert.not_before = Time.now
      ca_cert.not_after = ca_cert.not_before + (365 * 24 * 60 * 60)
      ef = OpenSSL::X509::ExtensionFactory.new
      ef.subject_certificate = ca_cert
      ef.issuer_certificate = ca_cert
      ca_cert.extensions = [
        ef.create_extension("keyUsage", "cRLSign,keyCertSign"),
        ef.create_extension("basicConstraints", "CA:true")
      ]

      ca_cert.sign ca_key, OpenSSL::Digest::SHA256.new

      File.binwrite("dev_ca.key", ca_key.to_pem)
      File.chmod(0600, "dev_ca.key")
      File.binwrite("dev_ca.crt", ca_cert.to_pem)

      puts "Wrote dev_ca.key and dev_ca.crt"

      if File.exist?("/usr/bin/security") && File.exist?("/Library/Keychains/System.keychain")
        puts "Adding to system keychain, you may be prompted for your password"
        sh "sudo security add-trusted-cert -d -r trustRoot \
-k /Library/Keychains/System.keychain dev_ca.crt"
      else
        puts "You will have to add dev_ca.crt to your trusted certificates manually"
      end

      [ca_key, ca_cert]
    end
  end

  def run # rubocop:disable Metrics/MethodLength, Metrics/AbcSize
    require "openssl"

    ca_key, ca_cert = obtain_ca(force_rebuild_ca)
    key = OpenSSL::PKey::RSA.generate(2048)

    cert = OpenSSL::X509::Certificate.new
    cert.version = 2
    cert.serial = Time.now.to_i
    cert.subject =
      OpenSSL::X509::Name.new(
        [["O", "New England Interactive Literature"], %w[emailAddress webmaster@intercode.test], %w[CN intercode.test]]
      )
    cert.issuer = ca_cert.subject
    cert.public_key = key.public_key
    cert.not_before = Time.now
    cert.not_after = cert.not_before + (365 * 24 * 60 * 60)

    ef = OpenSSL::X509::ExtensionFactory.new
    ef.subject_certificate = cert
    ef.issuer_certificate = ca_cert
    cert.extensions = [
      ef.create_extension("subjectKeyIdentifier", "hash"),
      ef.create_extension(
        "subjectAltName",
        %w[DNS:intercode.test DNS:*.intercode.test DNS:interconu.intercode.test DNS:localhost].join(",")
      )
    ]
    cert.add_extension ef.create_extension("authorityKeyIdentifier", "keyid,issuer")

    cert.sign ca_key, OpenSSL::Digest::SHA256.new

    File.binwrite("dev_certificate.key", key.to_pem)
    File.chmod(0600, "dev_certificate.key")
    File.binwrite("dev_certificate.crt", cert.to_pem)

    puts "Wrote dev_certificate.key and dev_certificate.crt"
  end
end

tool "update_schema" do
  desc "Regenerate the GraphQL schema and documentation"

  include :exec, exit_on_nonzero_status: true
  flag :publish

  def run
    sh "bin/rake graphql:schema:dump"
    sh "yarn run graphql:build_type_data"
    sh "yarn run graphql:codegen"

    return unless publish
    Dir.mktmpdir do |dir|
      sh "git clone --depth 1 -b gh-pages $(git remote get-url origin) #{dir}"

      dest_dir = File.expand_path("schema", dir)
      FileUtils.rm_rf(dest_dir)
      sh "yarn run graphqldoc:generate -o #{dest_dir}"

      Dir.chdir(dir) do
        sh "git add --all ."
        sh "git commit -m 'Schema docs update'"
        sh "git push"
      end
    end
  end
end

tool "pull_production_db" do
  desc "Pull down the production database into development"
  include :exec, exit_on_nonzero_status: true
  required_arg :database_url
  flag :docker_compose
  flag :include_form_response_changes
  flag :include_ahoy_data

  def run
    puts "Pulling production data"
    pull_options = ["--exclude-table-data=sessions"]
    pull_options << "--exclude-table-data=form_response_changes" unless include_form_response_changes
    pull_options << "--exclude-table-data=ahoy_events --exclude-table-data=ahoy_visits" unless include_ahoy_data
    cmd =
      "docker run -i -t --mount type=bind,source=\"#{Dir.pwd}\",target=/out postgres:17 \
pg_dump #{pull_options.join(" ")} -v -x --no-owner -Fp \"#{database_url}\" \
-f /out/intercode_production.sql"
    puts cmd
    sh cmd

    exec_tool("load_production_db #{docker_compose ? "--docker-compose" : ""}")
  end
end

tool "load_production_db" do
  desc "Load a production pgdump into development"
  include :exec, exit_on_nonzero_status: true
  flag :file, default: "intercode_production.sql"
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

tool "build_sanitized_db" do
  desc "Build a sanitized database from the existing dev database"
  include :exec, exit_on_nonzero_status: true

  def run
    puts "Copying dev database for sanitization"
    sh "dropdb -U postgres --if-exists intercode_sanitized_tmp"
    sh "createdb -U postgres -T intercode_development intercode_sanitized_tmp"

    database_url = "postgres://postgres@localhost/intercode_sanitized_tmp"
    sh "./bin/rails sanitize_db DEVELOPMENT_DATABASE_URL=#{database_url}"

    puts "Creating pgdump file"
    filename = "intercode_sanitized_#{Time.now.strftime("%Y-%m-%d")}.pgdump"
    sh "pg_dump -Fc -d intercode_sanitized_tmp -f #{filename}"

    puts "Dropping temporary database"
    sh "dropdb -U postgres intercode_sanitized_tmp"
  end
end

tool "pull_uploads" do
  desc "Pull uploaded files down from production"
  include :bundler

  required_arg :base64_blob_verifier_secret,
               desc:
                 "The base64-encoded version of the production blob verifier secret.  To get this, run in a production \
console: Base64.encode64(ActiveStorage::Blob.signed_id_verifier.instance_variable_get(:@secret))"

  def run
    require_relative "config/environment"

    verifier = ActiveSupport::MessageVerifier.new Base64.decode64(base64_blob_verifier_secret)

    scope = ActiveStorage::Attachment.joins(:blob).where(blob: { service_name: "amazon" })
    total_count = scope.count
    scope.find_each.each_with_index do |attachment, index|
      if attachment.blob
        puts "[#{index + 1}/#{total_count}] Downloading #{attachment.blob.filename} (#{attachment.blob.key})"
        download_attachment(attachment, verifier)
      else
        puts "[#{index + 1}/#{total_count}] Skipping attachment #{attachment.id} because it has no blob"
      end
    end
  end

  def download_attachment(attachment, verifier)
    prod_url =
      "https://www.neilhosting.net/rails/active_storage/blobs/redirect/#{
        verifier.generate(attachment.blob.id, purpose: :blob_id)
      }/#{Rack::Utils.escape attachment.blob.filename}"
    actual_url = Net::HTTP.get_response(URI.parse(prod_url))["location"]
    content = Net::HTTP.get(URI.parse(actual_url))

    record = attachment.record
    return unless record

    record.public_send(attachment.name).attach(
      io: StringIO.new(content),
      filename: attachment.blob.filename,
      content_type: attachment.blob.content_type
    )
  end
end

tool "cleanup_branches" do
  desc "Clean up local branches that were deleted or merged in origin"
  include :exec, exit_on_nonzero_status: true

  def run
    sh "git fetch origin --prune"
    sh 'git branch --merged | egrep -v "(^\*|main)" | xargs git branch -d'
  end
end

tool "update_liquid_doc_json" do
  desc "Generate a new liquid_doc.json by introspecting the Liquid code"

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
    { name: meth.name, docstring: meth.docstring, tags: meth.tags.map { |tag| serialize_tag(tag) } }
  end

  def serialize_tag(tag)
    { tag_name: tag.tag_name, name: tag.name, text: tag.text, types: tag.types }
  end

  def serialize_registry
    classes = YARD::Registry.all.select { |obj| obj.is_a?(YARD::CodeObjects::ClassObject) }
    filters_module =
      YARD::Registry.all.find do |obj|
        obj.is_a?(YARD::CodeObjects::ModuleObject) && obj.path == "Intercode::Liquid::Filters"
      end

    {
      classes: classes.map { |klass| serialize_class(klass) },
      filter_methods:
        filters_module.meths.select { |meth| meth.visibility == :public }.map { |meth| serialize_method(meth) }
    }
  end

  def run
    require "yard"
    require "json"
    require "pry"

    YARD::Tags::Library.define_tag("Liquid tag name", :liquid_tag_name)

    %w[app/liquid_drops/**/*.rb lib/intercode/liquid/**/*.rb app/models/cms_variable.rb].each do |path|
      YARD.parse(path)
    end

    File.write("liquid_doc.json", JSON.pretty_generate(serialize_registry))
  end
end

tool "download_email" do
  desc "Download and decrypt an email from the S3 inbox"
  required_arg :message_id

  def run
    require_relative "config/environment"

    ENV["AWS_PROFILE"] = "neil"
    ENV["AWS_REGION"] = "us-east-1"
    message =
      ReceiveSnsEmailDeliveryService.new.s3_client.get_object(bucket: "intercode-inbox", key: message_id).body.read
    File.write("#{message_id}.eml", message)
  end
end
