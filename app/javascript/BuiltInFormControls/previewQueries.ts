import gql from 'graphql-tag';

export const PreviewLiquidQuery = gql`
query PreviewLiquidQuery($liquid: String!) {
  previewLiquid(content: $liquid)
}
`;

export const PreviewMarkdownQuery = gql`
query PreviewMarkdownQuery($markdown: String!) {
  previewMarkdown(markdown: $markdown)
}
`;

export const PreviewNotifierLiquidQuery = gql`
query PreviewNotifierLiquidQuery($eventKey: String!, $liquid: String!) {
  previewLiquid: previewNotifierLiquid(eventKey: $eventKey, content: $liquid)
}
`;
