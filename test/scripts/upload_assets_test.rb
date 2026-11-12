# frozen_string_literal: true
require "test_helper"
require "open3"
require "tmpdir"

# Runs the upload scripts against stand-ins for the AWS CLI and boto3 that answer from files and log what they were
# asked to do
describe "the assets bucket upload scripts" do
  let(:stub_aws) { <<~BASH }
      #!/usr/bin/env bash
      echo "$*" >> "$AWS_STUB_LOG"
    BASH

  let(:stub_boto3) { <<~'PYTHON' }
      import os

      def _log(line):
          with open(os.environ["AWS_STUB_LOG"], "a") as f:
              f.write(line + "\n")

      def _lines(path):
          with open(path) as f:
              return [line for line in f.read().split("\n") if line]

      class _Paginator:
          def paginate(self, Bucket, Prefix):
              _log(f"s3api list-objects-v2 --prefix {Prefix}")
              keys = [k for k in _lines(os.environ["AWS_STUB_BUCKET_KEYS"]) if k.startswith(Prefix)]
              return [{"Contents": [{"Key": k} for k in keys]}] if keys else [{}]

      class _Client:
          def get_paginator(self, name):
              return _Paginator()

          def get_object_tagging(self, Bucket, Key):
              _log(f"s3api get-object-tagging --key {Key}")
              tagged = Key in _lines(os.environ["AWS_STUB_TAGGED"])
              return {"TagSet": [{"Key": "obsolete", "Value": "true"}] if tagged else []}

          def head_object(self, Bucket, Key):
              _log(f"s3api head-object --key {Key}")
              return {"CacheControl": "public, max-age=1", "ContentType": "text/javascript"}

          def copy_object(self, Bucket, Key, CopySource, MetadataDirective, TaggingDirective, Tagging, **metadata):
              if Key == os.environ.get("AWS_STUB_FAIL_KEY"):
                  raise RuntimeError(f"copy of {Key} failed")
              assert CopySource == {"Bucket": Bucket, "Key": Key}
              assert MetadataDirective == "REPLACE" and TaggingDirective == "REPLACE"
              _log(
                  f"s3api copy-object --key {Key} --cache-control {metadata.get('CacheControl')} "
                  f"--content-type {metadata.get('ContentType')} --tagging {Tagging}"
              )

      def client(service):
          assert service == "s3"
          return _Client()
    PYTHON

  def stub_env(dir, bucket_keys, tagged)
    FileUtils.mkdir_p(File.join(dir, "bin"))
    FileUtils.mkdir_p(File.join(dir, "pylib"))
    aws = File.join(dir, "bin/aws")
    File.write(aws, stub_aws)
    FileUtils.chmod(0o755, aws)
    File.write(File.join(dir, "pylib/boto3.py"), stub_boto3)
    File.write(File.join(dir, "bucket_keys"), bucket_keys.join("\n"))
    File.write(File.join(dir, "tagged"), tagged.join("\n"))
    {
      "PATH" => "#{File.join(dir, "bin")}:#{ENV.fetch("PATH")}",
      "PYTHONPATH" => File.join(dir, "pylib"),
      "AWS_STUB_LOG" => File.join(dir, "log"),
      "AWS_STUB_BUCKET_KEYS" => File.join(dir, "bucket_keys"),
      "AWS_STUB_TAGGED" => File.join(dir, "tagged")
    }
  end

  # A Hash as the last argument is added to the script's environment
  def run_script(script, *args, bucket_keys:, tagged: [], fail_key: nil)
    env = args.last.is_a?(Hash) ? args.pop : {}
    Dir.mktmpdir do |dir|
      full_env = stub_env(dir, bucket_keys, tagged).merge(env)
      full_env["AWS_STUB_FAIL_KEY"] = fail_key if fail_key
      resolved_args = args.map { |arg| arg.respond_to?(:call) ? arg.call(dir) : arg }
      _out, err, status = Open3.capture3(full_env, Rails.root.join(script).to_s, *resolved_args)
      assert_equal fail_key.nil?, status.success?, err
      File.exist?(full_env["AWS_STUB_LOG"]) ? File.readlines(full_env["AWS_STUB_LOG"], chomp: true) : []
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
      assert_includes copies.first, "--cache-control public, max-age=1 --content-type text/javascript"
      assert_includes copies.first, "--tagging obsolete=true"
      assert(calls.none? { |call| call.include?("--key assets/older-TAGGED.js") && call.start_with?("s3api copy") })
      assert(calls.none? { |call| call.include?("packs/untouched.js") || call.include?("--key index.html") })
    end

    it "lists only the assets/ prefix" do
      listing = calls.find { |call| call.start_with?("s3api list-objects-v2") }

      assert_includes listing, "--prefix assets/"
    end

    describe "in phases" do
      def phase_calls(phase)
        run_script(
          "script/uploadFrameworkAssets.sh",
          "the-bucket",
          method(:framework_build),
          phase,
          bucket_keys: %w[assets/shared-SAME.js assets/old-OLD.js]
        )
      end

      it "uploads only the hashed files in the hashed phase, and marks nothing" do
        calls = phase_calls("hashed")

        assert_equal 1, calls.size
        assert_includes calls.first, "s3://the-bucket/assets --recursive"
      end

      it "uploads only index.html in the publish phase, then marks the dropped files" do
        calls = phase_calls("publish")

        uploads = calls.select { |call| call.start_with?("s3 cp") }
        assert_equal 1, uploads.size
        assert_includes uploads.first, "s3://the-bucket/index.html"
        assert(calls.any? { |call| call.start_with?("s3api copy-object") && call.include?("--key assets/old-OLD.js") })
      end
    end
  end

  describe "script/uploadFrameworkAssets.sh without index.html (the assets bucket)" do
    def calls_without_index(phase)
      run_script(
        "script/uploadFrameworkAssets.sh",
        "the-bucket",
        method(:framework_build),
        phase,
        { "UPLOAD_INDEX" => "false" },
        bucket_keys: %w[assets/shared-SAME.js assets/old-OLD.js]
      )
    end

    it "uploads no index.html in the publish phase, but still marks the dropped files" do
      calls = calls_without_index("publish")

      assert(calls.none? { |call| call.start_with?("s3 cp") })
      assert(calls.any? { |call| call.start_with?("s3api copy-object") && call.include?("--key assets/old-OLD.js") })
    end

    it "still uploads the hashed files in the hashed phase" do
      calls = calls_without_index("hashed")

      assert_equal 1, calls.size
      assert_includes calls.first, "s3://the-bucket/assets --recursive"
    end

    it "fails when marking a file fails" do
      run_script(
        "script/uploadFrameworkAssets.sh",
        "the-bucket",
        method(:framework_build),
        "publish",
        bucket_keys: %w[assets/old-OLD.js],
        fail_key: "assets/old-OLD.js"
      )
    end
  end

  describe "script/mark_obsolete_assets.py with no current files (what the cutover does to packs/)" do
    it "marks every untagged file under the prefix and nothing else" do
      calls =
        run_script(
          "script/mark_obsolete_assets.py",
          "the-bucket",
          "packs/",
          bucket_keys: %w[packs/a-AAA.js packs/b-BBB.js packs/c-TAGGED.js assets/current-CCC.js],
          tagged: ["packs/c-TAGGED.js"]
        )

      marked = calls.select { |call| call.start_with?("s3api copy-object") }.map { |call| call[/--key (\S+)/, 1] }
      assert_equal %w[packs/a-AAA.js packs/b-BBB.js], marked.sort
    end
  end
end
