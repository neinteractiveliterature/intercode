#!/usr/bin/env ruby
# frozen_string_literal: true

# Merge multiple Cobertura XML coverage files into one by summing line hits.
# Usage: ruby scripts/merge_coverage.rb output.xml input1.xml [input2.xml ...]

require "rexml/document"

if ARGV.length < 2
  warn "Usage: #{$PROGRAM_NAME} output.xml input1.xml [input2.xml ...]"
  exit 1
end

output_path = ARGV[0]
input_paths = ARGV[1..]

# Sum hits per [filename, line_number] across all inputs
file_lines = Hash.new { |h, k| h[k] = Hash.new(0) }

input_paths.each do |path|
  doc = REXML::Document.new(File.read(path))
  doc
    .elements
    .each("//class") do |cls|
      fname = cls.attributes["filename"]
      cls
        .elements
        .each("lines/line") { |line| file_lines[fname][line.attributes["number"].to_i] += line.attributes["hits"].to_i }
    end
rescue StandardError => e
  warn "Warning: could not parse #{path}: #{e}"
end

# Build output XML
total_lines = total_covered = 0

doc = REXML::Document.new
doc << REXML::XMLDecl.new("1.0", "UTF-8")
coverage_el =
  doc.add_element(
    "coverage",
    {
      "branch-rate" => "0",
      "branches-covered" => "0",
      "branches-valid" => "0",
      "complexity" => "0",
      "version" => "0.1"
    }
  )
coverage_el.add_element("sources")
packages_el = coverage_el.add_element("packages")
package_el = packages_el.add_element("package", { "name" => "intercode", "complexity" => "0" })
classes_el = package_el.add_element("classes")

file_lines.sort.each do |fname, lines|
  covered = lines.count { |_, hits| hits.positive? }
  total = lines.size
  total_lines += total
  total_covered += covered
  line_rate = total.positive? ? (covered.to_f / total).round(4) : 1.0

  class_el =
    classes_el.add_element(
      "class",
      { "name" => fname, "filename" => fname, "complexity" => "0", "line-rate" => line_rate.to_s }
    )
  lines_el = class_el.add_element("lines")
  lines.sort.each { |lineno, hits| lines_el.add_element("line", { "number" => lineno.to_s, "hits" => hits.to_s }) }
end

overall = total_lines.positive? ? (total_covered.to_f / total_lines).round(4) : 1.0
coverage_el.attributes["line-rate"] = overall.to_s
coverage_el.attributes["lines-covered"] = total_covered.to_s
coverage_el.attributes["lines-valid"] = total_lines.to_s
package_el.attributes["line-rate"] = overall.to_s

formatter = REXML::Formatters::Pretty.new(2)
formatter.compact = true
output = +""
formatter.write(doc, output)
File.write(output_path, output)

puts "Merged #{file_lines.size} files, overall line rate: #{overall}"
