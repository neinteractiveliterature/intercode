PgSearch.multisearch_options = {
  using: {
    tsearch: {
      dictionary: 'english_unaccent',
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
