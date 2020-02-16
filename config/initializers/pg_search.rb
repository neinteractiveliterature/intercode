PgSearch.multisearch_options = {
  using: {
    tsearch: {
      dictionary: 'english',
      tsvector_column: 'content_vector',
      highlight: {
        StartSel: '<mark>',
        StopSel: '</mark>',
        MaxFragments: 3,
        FragmentDelimiter: '&hellip;'
      }
    }
  },
  ignoring: :accents
}
