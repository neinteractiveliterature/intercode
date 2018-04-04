module Concerns::CmsReferences
  def each_liquid_node(&block)
    each_node_in_liquid_block(liquid_template.root, &block)
  end

  def each_node_in_liquid_block(liquid_block, &block)
    return to_enum(__method__, liquid_block) unless block_given?

    liquid_block.nodelist.each do |node|
      yield node

      case node
      when Liquid::Block, Liquid::BlockBody
        each_node_in_liquid_block(node, &block)
      end
    end
  end

  def referenced_partial_names
    each_liquid_node
      .select { |node| node.is_a?(Liquid::Include) }
      .map do |include_node|
        regexp = /\A#{Regexp.escape include_node.tag_name}\s+#{Liquid::Include::Syntax}/
        next unless include_node.raw =~ regexp
        Liquid::Expression.parse(Regexp.last_match(1))
      end
      .compact
  end

  def referenced_partials_direct(blacklist = [])
    names = referenced_partial_names - blacklist
    return [] if names.none?

    if parent_id && parent_type
      CmsPartial.where(parent_id: parent_id, parent_type: parent_type, name: names)
    else
      CmsPartial.global.where(name: names)
    end
  end

  def referenced_partials_recursive(blacklist = [])
    direct_partials = referenced_partials_direct(blacklist)
    direct_partials + direct_partials.flat_map do |partial|
      partial.referenced_partials_recursive(blacklist + direct_partials.map(&:name))
    end
  end

  def referenced_file_names
    each_liquid_node
      .select { |node| node.is_a?(CadmusFiles::FileUrlTag) }
      .map(&:filename)
  end

  def referenced_files_recursive
    CmsFile.where(name: (
      referenced_file_names + referenced_partials_recursive.map(&:referenced_file_names)
    ))
  end
end
