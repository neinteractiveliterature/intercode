import { Suspense, CSSProperties, ReactNode, useLayoutEffect, useState, useEffect } from 'react';
import * as React from 'react';
import camelCase from 'lodash/camelCase';
import IsValidNodeDefinitions from 'html-to-react/lib/is-valid-node-definitions';
import camelCaseAttrMap from 'html-to-react/lib/camel-case-attribute-names';
import { Link } from 'react-router';
import { ErrorBoundary } from '@neinteractiveliterature/litform';
import { clientOnly$, serverOnly$ } from 'vite-env-only/macros';
import { JSDOM } from 'jsdom';

import SignInButton from './Authentication/SignInButton';
import SignOutButton from './Authentication/SignOutButton';
import SignUpButton from './Authentication/SignUpButton';
import Spoiler from './Spoiler';
import errorReporting from 'ErrorReporting';

export type MinimalWindow = {
  location: {
    href: typeof window.location.href;
    origin: typeof window.location.origin;
  };
};

export type ComponentMap = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [name: string]: React.ComponentType<any>;
};

export const DEFAULT_COMPONENT_MAP: ComponentMap = {
  Spoiler,
  SignInButton,
  SignOutButton,
  SignUpButton,
};

export type ProcessingInstruction<T> = {
  shouldProcessNode: (node: Node, nodeObject: typeof Node) => boolean;
  processNode: (
    node: T,
    children: Node[] | ReactNode[],
    index: number,
    nodeObject: typeof Node,
    document: Document,
    window: MinimalWindow,
  ) => ReactNode;
  replaceChildren?: boolean;
};

function nodeIsElement(node: Node, nodeObject: typeof Node): node is Element {
  return node.nodeType === nodeObject.ELEMENT_NODE;
}

export type ScriptTagProps = {
  url: string | null;
  content: string | null;
  type: HTMLScriptElement['type'] | null;
};

export function ScriptTag({ url, content, type }: ScriptTagProps) {
  const ref = React.useRef<HTMLMetaElement>(null);
  useLayoutEffect(() => {
    if (!ref.current) {
      return;
    }

    const script = document.createElement('script');
    if (type != null) {
      script.type = type;
    }

    if (url != null) {
      script.src = url;
      script.async = true;
    }

    if (content != null) {
      script.textContent = content;
    }

    const originalSpan = ref.current;
    ref.current.replaceWith(script);

    return () => {
      script.replaceWith(originalSpan);
    };
  }, [url, content, type]);

  return <meta ref={ref} />;
}

export function ScriptTagWrapper(props: ScriptTagProps) {
  const [showChild, setShowChild] = useState(false);

  // Wait until after client-side hydration to show
  useEffect(() => {
    setShowChild(true);
  }, []);

  if (!showChild) {
    // You can show some kind of placeholder UI here
    return null;
  }

  return <ScriptTag {...props} />;
}

// adapted from html-to-react library

const voidElementTags = [
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
  'menuitem',
  'textarea',
];

function createStyleJsonFromString(style: string) {
  const styleString = style || '';
  const styles = styleString.split(/;(?!base64)/);
  let singleStyle: string[];
  let key: string;
  let value: string | undefined;
  const jsonStyles: CSSProperties = {};
  for (let i = 0; i < styles.length; i += 1) {
    singleStyle = styles[i].split(':');
    if (singleStyle.length > 2) {
      singleStyle[1] = singleStyle.slice(1).join(':');
    }

    [key, value] = singleStyle;
    if (typeof value === 'string') {
      value = value.trim();
    }

    if (key != null && value != null && key.length > 0 && value.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (jsonStyles as any)[camelCase(key as keyof CSSProperties)] = value as any;
    }
  }
  return jsonStyles;
}

function jsxAttributeKeyForHtmlKey(htmlKey: string) {
  const key = (camelCaseAttrMap as { [key: string]: string })[htmlKey.replace(/[-:]/, '')] || htmlKey;

  if (key === 'class') {
    return 'className';
  }

  if (key === 'for') {
    return 'htmlFor';
  }

  return key;
}

function jsxAttributesFromHTMLAttributes(node: Element, attributes: Attr[], document: Document) {
  const testingNode = document.createElement(node.tagName);

  return attributes.reduce((result: { [key: string]: string }, attribute: Attr) => {
    const key = jsxAttributeKeyForHtmlKey(attribute.name);
    if (key === 'style') {
      return { ...result, [key]: createStyleJsonFromString(attribute.value) };
    }

    try {
      testingNode.setAttribute(key, attribute.value ?? attribute.name);
    } catch {
      errorReporting().warning(`Invalid attribute ${key} for ${node.tagName} while parsing CMS content`);
      return result;
    }

    return { ...result, [key]: attribute.value ?? attribute.name };
  }, {});
}

function createElement(node: Element, index: number, document: Document, data?: ReactNode, children?: ReactNode[]) {
  const attributeProps = jsxAttributesFromHTMLAttributes(node, [...node.attributes], document);

  const elementProps = {
    key: index,
    ...attributeProps,
  };

  const allChildren = data != null ? [data, ...(children ?? [])] : [...(children ?? [])];
  return React.createElement(node.nodeName.toLowerCase(), elementProps, ...allChildren);
}

function processDefaultNode(
  node: Node,
  children: ReactNode[],
  index: number,
  nodeObject: typeof Node,
  document: Document,
) {
  if (node.nodeType === nodeObject.TEXT_NODE) {
    return node.textContent;
  }

  if (node.nodeType === nodeObject.COMMENT_NODE) {
    // FIXME: The following doesn't work as the generated HTML results in
    // "&lt;!--  This is a comment  --&gt;"
    // return '<!-- ' + node.data + ' -->';
    return false;
  }

  if (nodeIsElement(node, nodeObject) && node.tagName.toLowerCase() === 'script') {
    return (
      <ScriptTagWrapper
        key={index}
        url={node.getAttribute('src')}
        content={node.textContent}
        type={node.getAttribute('type')}
      />
    );
  }

  if (voidElementTags.includes(node.nodeName)) {
    return createElement(node as Element, index, document);
  }

  // @ts-expect-error I don't know what's up with node.data but I'm afraid to change it
  return createElement(node as Element, index, document, node.data, children);
}

const AUTHENTICATION_LINK_REPLACEMENTS = {
  '/users/sign_in': (node: Element) => (
    <SignInButton
      className={node.attributes.getNamedItem('class')?.value ?? 'btn btn-link d-inline p-0'}
      caption={node.textContent}
    />
  ),
  '/users/sign_up': (node: Element) => (
    <SignUpButton
      className={node.attributes.getNamedItem('class')?.value ?? 'btn btn-primary btn-sm'}
      caption={node.textContent}
    />
  ),
  '/users/sign_out': (node: Element) => (
    <SignOutButton className={node.attributes.getNamedItem('class')?.value} caption={node.textContent} />
  ),
};

const AUTHENTICATION_LINK_PROCESSING_INSTRUCTIONS: ProcessingInstruction<Element>[] = Object.entries(
  AUTHENTICATION_LINK_REPLACEMENTS,
).map(([path, processNode]) => ({
  shouldProcessNode: (node: Node, nodeObject: typeof Node) =>
    nodeIsElement(node, nodeObject) &&
    node.nodeName.toLowerCase() === 'a' &&
    ((node.attributes.getNamedItem('href') || {}).value || '').endsWith(path),
  processNode,
}));

function processReactComponentNode(
  node: Element,
  children: ReactNode[],
  index: number,
  componentMap: ComponentMap,
  nodeObject: typeof Node,
  document: Document,
) {
  const componentClass = node.attributes.getNamedItem('data-react-class')?.value;
  const component = componentMap[componentClass ?? ''];
  if (!component) {
    return processDefaultNode(node, children, index, nodeObject, document);
  }

  const props = JSON.parse((node.attributes.getNamedItem('data-react-props') || { value: '{}' }).value);
  return React.createElement(
    Suspense,
    { fallback: <></>, key: index },
    React.createElement(ErrorBoundary, { errorType: 'graphql' }, React.createElement(component, props)),
  );
}

function getURLOrigin(href: string) {
  try {
    return new URL(href, window.location.href).origin;
  } catch {
    return undefined;
  }
}

function processCmsLinkNode(
  node: Element,
  children: ReactNode[],
  index: number,
  nodeObject: typeof Node,
  document: Document,
  window: MinimalWindow,
) {
  const attributesArray = [...node.attributes];
  const hrefAttribute = attributesArray.find((attribute) => (attribute.name || '').toLowerCase() === 'href');
  const otherAttributes = attributesArray.filter((attribute) => (attribute.name || '').toLowerCase() !== 'href');
  const href = (hrefAttribute || {}).value;

  if (href && !href.startsWith('#') && getURLOrigin(href) === window.location.origin) {
    return (
      <Link to={href} key={index} {...jsxAttributesFromHTMLAttributes(node, otherAttributes, document)}>
        {children}
      </Link>
    );
  }

  return processDefaultNode(node, children, index, nodeObject, document);
}

function traverseDom(
  node: Node,
  isValidNode: (node: Node, nodeObject: typeof Node) => boolean,
  processingInstructions: ProcessingInstruction<unknown>[],
  index: number,
  nodeObject: typeof Node,
  document: Document,
  window: MinimalWindow,
): ReactNode | false {
  if (isValidNode(node, nodeObject)) {
    const processingInstruction = processingInstructions.find((instruction) =>
      instruction.shouldProcessNode(node, nodeObject),
    );

    if (processingInstruction != null) {
      const traversedChildren = [...node.childNodes].map((child, i) =>
        traverseDom(child, isValidNode, processingInstructions, i, nodeObject, document, window),
      );
      const children = traversedChildren.filter((x) => x != null && x !== false);

      if (processingInstruction.replaceChildren) {
        return createElement(node as Element, index, document, null, [
          processingInstruction.processNode(node, children, index, nodeObject, document, window),
        ]);
      }
      return processingInstruction.processNode(node, children, index, nodeObject, document, window);
    }

    return false;
  }

  return false;
}

function traverseWithInstructions(
  nodes: NodeList,
  isValidNode: (node: Node) => boolean,
  processingInstructions: ProcessingInstruction<unknown>[],
  nodeObject: typeof Node,
  document: Document,
  window: MinimalWindow,
): ReactNode | ReactNode[] {
  const list = [...nodes].map((domTreeItem, index) =>
    traverseDom(domTreeItem, isValidNode, processingInstructions, index, nodeObject, document, window),
  );
  return list.length <= 1 ? list[0] : list;
}

function buildProcessingInstructions(componentMap: ComponentMap): ProcessingInstruction<unknown>[] {
  return [
    ...AUTHENTICATION_LINK_PROCESSING_INSTRUCTIONS,
    {
      shouldProcessNode: (node, nodeObject) => nodeIsElement(node, nodeObject) && node.nodeName.toLowerCase() === 'a',
      processNode: processCmsLinkNode,
    },
    {
      shouldProcessNode: (node, nodeObject) =>
        nodeIsElement(node, nodeObject) && node.attributes.getNamedItem('data-react-class') != null,
      processNode: (node: Element, children: ReactNode[], index: number, nodeObject: typeof Node, document: Document) =>
        processReactComponentNode(node, children, index, componentMap, nodeObject, document),
    },
    {
      shouldProcessNode: () => true,
      processNode: processDefaultNode,
    },
  ];
}

export function parseDocument(
  doc: Document,
  componentMap: ComponentMap,
  nodeObject: typeof Node,
  window: MinimalWindow,
) {
  const processingInstructions = buildProcessingInstructions(componentMap);
  const bodyComponents = traverseWithInstructions(
    doc.body.childNodes,
    IsValidNodeDefinitions.alwaysValid,
    processingInstructions,
    nodeObject,
    doc,
    window,
  );
  const headComponents = traverseWithInstructions(
    doc.head.childNodes,
    // Text nodes cannot be direct children of the document <head>
    (node) => node.parentElement !== doc.head || node.nodeType !== nodeObject.TEXT_NODE,
    processingInstructions,
    nodeObject,
    doc,
    window,
  );
  return { bodyComponents, headComponents };
}

export type ParseContentFunction = (
  content: string,
  componentMap?: ComponentMap,
) => { bodyComponents: ReactNode; headComponents: ReactNode };

export const parseContent: ParseContentFunction = (content, componentMap = DEFAULT_COMPONENT_MAP) => {
  let result: { bodyComponents: ReactNode; headComponents: ReactNode } = {
    // eslint-disable-next-line i18next/no-literal-string
    bodyComponents: <>WARNING: neither serverOnly$ nor clientOnly$ was compiled in parsePageContent.tsx</>,
    headComponents: <></>,
  };

  const parse =
    serverOnly$(() => {
      const dom = new JSDOM(content);
      // eslint-disable-next-line no-underscore-dangle
      result = parseDocument(dom.window._document, componentMap, dom.window.Node, dom.window);
    }) ??
    clientOnly$(() => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');
      result = parseDocument(doc, componentMap, Node, window);
    });

  if (parse) {
    parse();
  }

  return result;
};
