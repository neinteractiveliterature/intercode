# frozen_string_literal: true
require "test_helper"
require "open3"
require "tmpdir"

describe "script/substituteAssetsHost.sh" do
  let(:placeholder) { "https://ASSETHOSTPLACEHOLDER.invalid/" }
  let(:script) { Rails.root.join("script/substituteAssetsHost.sh").to_s }

  def with_build
    Dir.mktmpdir do |dir|
      FileUtils.mkdir_p(File.join(dir, "assets"))
      File.write(File.join(dir, "index.html"), %(<link rel="modulepreload" href="#{placeholder}assets/entry.js"/>))
      File.write(
        File.join(dir, "assets/manifest.js"),
        %({"a":"#{placeholder}assets/a.js","b":"#{placeholder}assets/b.js"})
      )
      File.write(File.join(dir, "assets/entry.css"), "@font-face{src:url(#{placeholder}assets/icons.woff2)}")
      File.write(File.join(dir, "assets/chunk.js"), "export default 1")
      File.binwrite(File.join(dir, "assets/icons.woff2"), "\x00\x01wOF2\xFF".b)
      yield dir
    end
  end

  def read(dir, path)
    File.read(File.join(dir, path))
  end

  it "points every URL at the assets host" do
    with_build do |dir|
      _out, err, status = Open3.capture3(script, dir, "assets.example.com:3135")

      assert status.success?, err
      assert_includes read(dir, "index.html"), 'href="https://assets.example.com:3135/assets/entry.js"'
      assert_includes read(dir, "assets/manifest.js"), %("a":"https://assets.example.com:3135/assets/a.js")
      assert_includes read(dir, "assets/manifest.js"), %("b":"https://assets.example.com:3135/assets/b.js")
      assert_includes read(dir, "assets/entry.css"), "url(https://assets.example.com:3135/assets/icons.woff2)"
    end
  end

  it "makes the URLs same-origin when there is no host" do
    with_build do |dir|
      _out, err, status = Open3.capture3(script, dir, "")

      assert status.success?, err
      assert_includes read(dir, "index.html"), 'href="/assets/entry.js"'
      assert_includes read(dir, "assets/entry.css"), "url(/assets/icons.woff2)"
    end
  end

  it "leaves files without the placeholder alone, including binary ones" do
    with_build do |dir|
      Open3.capture3(script, dir, "assets.example.com")

      assert_equal "export default 1", read(dir, "assets/chunk.js")
      assert_equal "\x00\x01wOF2\xFF".b, File.binread(File.join(dir, "assets/icons.woff2"))
      assert_empty Dir.glob(File.join(dir, "**/*.substituting"))
    end
  end

  it "rejects a host that isn't a bare host name" do
    with_build do |dir|
      _out, err, status = Open3.capture3(script, dir, "https://assets.example.com/")

      assert_not status.success?
      assert_includes err, "bare host name"
      assert_includes read(dir, "index.html"), placeholder
    end
  end

  it "uses the same placeholder as the framework build" do
    config = Rails.root.join("vite.framework.config.mts").read

    assert_includes config, "ASSETS_HOST_PLACEHOLDER = '#{placeholder}'"
    assert_includes File.read(script), "placeholder='#{placeholder}'"
  end
end
