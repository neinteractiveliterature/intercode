import { gql } from '@apollo/client';

export const PreviewLiquidQuery = gql`
  query PreviewLiquidQuery($liquid: String!) {
    cmsParent: cmsParentByRequestHost {
      id
      previewLiquid(content: $liquid)
    }
  }
`;

export const PreviewMarkdownQuery = gql`
  query PreviewMarkdownQuery($markdown: String!) {
    cmsParent: cmsParentByRequestHost {
      id
      previewMarkdown(markdown: $markdown)
    }
  }
`;

export const PreviewNotifierLiquidQuery = gql`
  query PreviewNotifierLiquidQuery($eventKey: String!, $liquid: String!) {
    convention: conventionByRequestHost {
      id
      previewLiquid: preview_notifier_liquid(eventKey: $eventKey, content: $liquid)
    }
  }
`;
