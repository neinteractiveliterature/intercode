# frozen_string_literal: true
require "test_helper"
require "open3"
require "tmpdir"

# Runs the upload scripts against a stand-in for the AWS CLI that answers from files and logs what it was asked to do
describe "the assets bucket upload scripts" do
  let(:stub_aws) { <<~'BASH' }
      #!/usr/bin/env bash
      echo "$*" >> "$AWS_STUB_LOG"
      case "$1 $2" in
        "s3 cp") ;;
        "s3api list-objects-v2")
          prefix=""
          while [ $# -gt 0 ]; do [ "$1" = "--prefix" ] && prefix="$2"; shift; done
          grep "^$prefix" "$AWS_STUB_BUCKET_KEYS" | tr '\n' '\t' ;;
        "s3api get-object-tagging")
          while [ $# -gt 0 ]; do [ "$1" = "--key" ] && key="$2"; shift; done
          if grep -qxF "$key" "$AWS_STUB_TAGGED"; then echo 1; else echo 0; fi ;;
        "s3api head-object") echo '{"CacheControl":"public, max-age=1","ContentType":"text/javascript"}' ;;
        "s3api copy-object") ;;
      esac
    BASH

  def stub_env(dir, bucket_keys, tagged)
    FileUtils.mkdir_p(File.join(dir, "bin"))
    aws = File.join(dir, "bin/aws")
    File.write(aws, stub_aws)
    FileUtils.chmod(0o755, aws)
    File.write(File.join(dir, "bucket_keys"), bucket_keys.join("\n"))
    File.write(File.join(dir, "tagged"), tagged.join("\n"))
    {
      "PATH" => "#{File.join(dir, "bin")}:#{ENV.fetch("PATH")}",
      "AWS_STUB_LOG" => File.join(dir, "log"),
      "AWS_STUB_BUCKET_KEYS" => File.join(dir, "bucket_keys"),
      "AWS_STUB_TAGGED" => File.join(dir, "tagged")
    }
  end

  def run_script(script, *args, bucket_keys:, tagged: [])
    Dir.mktmpdir do |dir|
      env = stub_env(dir, bucket_keys, tagged)
      resolved_args = args.map { |arg| arg.respond_to?(:call) ? arg.call(dir) : arg }
      _out, err, status = Open3.capture3(env, Rails.root.join(script).to_s, *resolved_args)
      assert status.success?, err
      File.exist?(env["AWS_STUB_LOG"]) ? File.readlines(env["AWS_STUB_LOG"], chomp: true) : []
    end
  end

  def framework_build(dir)
    build = File.join(dir, "build")
    FileUtils.mkdir_p(File.join(build, "assets"))
    File.write(File.join(build, "index.html"), "<html></html>")
    File.write(File.join(build, "assets/entry-NEW.js"), "new")
    File.write(File.join(build, "assets/shared-SAME.js"), "same")
    build
  end

  describe "script/uploadFrameworkAssets.sh" do
    let(:calls) do
      run_script(
        "script/uploadFrameworkAssets.sh",
        "the-bucket",
        method(:framework_build),
        bucket_keys: %w[assets/shared-SAME.js assets/old-OLD.js assets/older-TAGGED.js index.html packs/untouched.js],
        tagged: ["assets/older-TAGGED.js"]
      )
    end

    it "uploads the hashed files with a long cache, then index.html with a short one" do
      uploads = calls.select { |call| call.start_with?("s3 cp") }

      assert_equal 2, uploads.size
      assert_includes uploads[0], "/assets s3://the-bucket/assets --recursive --cache-control public, max-age=15552000"
      assert_includes uploads[1],
                      "s3://the-bucket/index.html --cache-control public, max-age=60 --content-type text/html"
    end

    it "marks only the dropped, untagged files under assets/ as obsolete" do
      copies = calls.select { |call| call.start_with?("s3api copy-object") }

      assert_equal 1, copies.size
      assert_includes copies.first, "--key assets/old-OLD.js"
      assert_includes copies.first, "--tagging obsolete=true"
      assert(calls.none? { |call| call.include?("packs/untouched.js") || call.include?("--key index.html") })
    end

    it "lists only the assets/ prefix" do
      listing = calls.find { |call| call.start_with?("s3api list-objects-v2") }

      assert_includes listing, "--prefix assets/"
    end
  end

  describe "script/uploadReleaseAssets.sh" do
    it "still marks files dropped from packs/ as obsolete and leaves other prefixes alone" do
      calls =
        run_script(
          "script/uploadReleaseAssets.sh",
          "the-bucket",
          lambda do |dir|
            packs = File.join(dir, "packs")
            FileUtils.mkdir_p(packs)
            File.write(File.join(packs, "current-AAA.js"), "x")
            packs
          end,
          bucket_keys: %w[packs/current-AAA.js packs/gone-BBB.js assets/other.js]
        )

      copies = calls.select { |call| call.start_with?("s3api copy-object") }

      assert_equal 1, copies.size
      assert_includes copies.first, "--key packs/gone-BBB.js"
    end
  end
end
