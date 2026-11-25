# frozen_string_literal: true

# Serves partials whose source has already been loaded (for example, all the partials a page refers to, fetched in one
# query) and falls back to looking each other one up by name. Liquid keeps its own cache of parsed partials under keys
# of its choosing, so preloading has to happen here, at the source level, to be seen by {% render %} and {% include %}.
class PreloadedPartialFileSystem < Cadmus::PartialFileSystem
  def initialize(parent, preloaded_sources)
    super(parent)
    @preloaded_sources = preloaded_sources
  end

  def read_template_file(template_path)
    @preloaded_sources.fetch(template_path) { super }
  end
end
