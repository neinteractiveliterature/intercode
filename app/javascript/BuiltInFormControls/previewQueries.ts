import { gql } from '@apollo/client';

export const PreviewLiquidQuery = gql`
  query PreviewLiquidQuery($liquid: String!) {
    cmsParent: cmsParentByRequestHost {
      id: transitionalId
      previewLiquid(content: $liquid)
    }
  }
`;

export const PreviewMarkdownQuery = gql`
  query PreviewMarkdownQuery($markdown: String!) {
    cmsParent: cmsParentByRequestHost {
      id: transitionalId
      previewMarkdown(markdown: $markdown)
    }
  }
`;

export const PreviewNotifierLiquidQuery = gql`
  query PreviewNotifierLiquidQuery($eventKey: String!, $liquid: String!) {
    convention: conventionByRequestHost {
      id: transitionalId
      previewLiquid: preview_notifier_liquid(eventKey: $eventKey, content: $liquid)
    }
  }
`;
