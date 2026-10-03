# frozen_string_literal: true
require "test_helper"
require "open3"
require "rexml/document"

describe "scripts/merge_coverage.rb" do
  def cobertura(files)
    classes =
      files.map do |filename, lines|
        line_xml = lines.map { |number, hits| "<line number='#{number}' hits='#{hits}'/>" }.join
        "<class name='#{filename}' filename='#{filename}'><lines>#{line_xml}</lines></class>"
      end
    "<coverage><packages><package><classes>#{classes.join}</classes></package></packages></coverage>"
  end

  def parse_merged(path)
    REXML::Document
      .new(File.read(path))
      .elements
      .to_a("//class")
      .to_h do |cls|
        [
          cls.attributes["filename"],
          cls.elements.to_a("lines/line").to_h { |l| [l.attributes["number"].to_i, l.attributes["hits"].to_i] }
        ]
      end
  end

  def merge(*inputs)
    Dir.mktmpdir do |dir|
      paths =
        inputs.each_with_index.map do |files, i|
          path = File.join(dir, "input#{i}.xml")
          File.write(path, cobertura(files))
          path
        end
      output = File.join(dir, "merged.xml")
      _stdout, stderr, status =
        Open3.capture3("ruby", Rails.root.join("scripts/merge_coverage.rb").to_s, output, *paths)
      assert status.success?, stderr

      parse_merged(output)
    end
  end

  it "sums hits for a file that multiple runs loaded" do
    merged = merge({ "a.rb" => { 1 => 1, 2 => 0 } }, { "a.rb" => { 1 => 2, 2 => 3 } })
    assert_equal({ 1 => 3, 2 => 3 }, merged["a.rb"])
  end

  it "ignores the invented line set of a run that never loaded the file" do
    real = { 1 => 1, 3 => 1 }
    # SimpleCov's track_files lists every non-blank line (including `end`) as uncovered
    simulated = { 1 => 0, 2 => 0, 3 => 0, 4 => 0, 5 => 0 }

    assert_equal({ 1 => 1, 3 => 1 }, merge({ "a.rb" => real }, { "a.rb" => simulated })["a.rb"])
    assert_equal({ 1 => 1, 3 => 1 }, merge({ "a.rb" => simulated }, { "a.rb" => real })["a.rb"])
  end

  it "keeps files that no run loaded as uncovered" do
    merged = merge({ "a.rb" => { 1 => 0, 2 => 0 } }, { "a.rb" => { 1 => 0, 2 => 0, 3 => 0 } })
    assert_equal({ 1 => 0, 2 => 0 }, merged["a.rb"])
  end

  it "includes files that only some inputs know about" do
    merged = merge({ "a.rb" => { 1 => 1 } }, { "b.ts" => { 1 => 0, 2 => 5 } })
    assert_equal({ 1 => 1 }, merged["a.rb"])
    assert_equal({ 1 => 0, 2 => 5 }, merged["b.ts"])
  end
end
