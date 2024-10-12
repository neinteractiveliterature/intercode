/* eslint-disable i18next/no-literal-string */
import { Suspense, CSSProperties, ReactNode, useLayoutEffect } from 'react';
import * as React from 'react';
import camelCase from 'lodash/camelCase';
import IsValidNodeDefinitions from 'html-to-react/lib/is-valid-node-definitions';
import camelCaseAttrMap from 'html-to-react/lib/camel-case-attribute-names';
import { Link } from 'react-router-dom';
import { ErrorBoundary } from '@neinteractiveliterature/litform';

import SignInButton from './Authentication/SignInButton';
import SignOutButton from './Authentication/SignOutButton';
import SignUpButton from './Authentication/SignUpButton';
import Spoiler from './Spoiler';
import errorReporting from 'ErrorReporting';

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
  shouldProcessNode: (node: Node) => boolean;
  processNode: (node: T, children: Node[] | ReactNode[], index: number) => ReactNode;
  replaceChildren?: boolean;
};

function nodeIsElement(node: Node): node is Element {
  return node.nodeType === Node.ELEMENT_NODE;
}

export type ScriptTagProps = {
  url: string | null;
  content: string | null;
};

export function ScriptTag({ url, content }: ScriptTagProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    if (!ref.current) {
      return;
    }

    const script = document.createElement('script');

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
  }, [url, content]);

  return <span ref={ref} />;
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

function jsxAttributesFromHTMLAttributes(node: Element, attributes: Attr[]) {
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

function createElement(node: Element, index: number, data?: ReactNode, children?: ReactNode[]) {
  const attributeProps = jsxAttributesFromHTMLAttributes(node, [...node.attributes]);

  const elementProps = {
    key: index,
    ...attributeProps,
  };

  const allChildren = data != null ? [data, ...(children ?? [])] : [...(children ?? [])];
  return React.createElement(node.nodeName.toLowerCase(), elementProps, ...allChildren);
}

function processDefaultNode(node: Node, children: ReactNode[], index: number) {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent;
  }

  if (node.nodeType === Node.COMMENT_NODE) {
    // FIXME: The following doesn't work as the generated HTML results in
    // "&lt;!--  This is a comment  --&gt;"
    // return '<!-- ' + node.data + ' -->';
    return false;
  }

  if (nodeIsElement(node) && node.tagName.toLowerCase() === 'script') {
    return <ScriptTag key={index} url={node.getAttribute('src')} content={node.textContent} />;
  }

  if (voidElementTags.includes(node.nodeName)) {
    return createElement(node as Element, index);
  }

  // @ts-expect-error I don't know what's up with node.data but I'm afraid to change it
  return createElement(node as Element, index, node.data, children);
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
  shouldProcessNode: (node: Node) =>
    nodeIsElement(node) &&
    node.nodeName.toLowerCase() === 'a' &&
    ((node.attributes.getNamedItem('href') || {}).value || '').endsWith(path),
  processNode,
}));

function processReactComponentNode(node: Element, children: ReactNode[], index: number, componentMap: ComponentMap) {
  const componentClass = node.attributes.getNamedItem('data-react-class')?.value;
  const component = componentMap[componentClass ?? ''];
  if (!component) {
    return processDefaultNode(node, children, index);
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

function processCmsLinkNode(node: Element, children: ReactNode[], index: number) {
  const attributesArray = [...node.attributes];
  const hrefAttribute = attributesArray.find((attribute) => (attribute.name || '').toLowerCase() === 'href');
  const otherAttributes = attributesArray.filter((attribute) => (attribute.name || '').toLowerCase() !== 'href');
  const href = (hrefAttribute || {}).value;

  if (href && !href.startsWith('#') && getURLOrigin(href) === window.location.origin) {
    return (
      <Link to={href} key={index} {...jsxAttributesFromHTMLAttributes(node, otherAttributes)}>
        {children}
      </Link>
    );
  }

  return processDefaultNode(node, children, index);
}

function traverseDom(
  node: Node,
  isValidNode: (node: Node) => boolean,
  processingInstructions: ProcessingInstruction<unknown>[],
  index: number,
): ReactNode | false {
  if (isValidNode(node)) {
    const processingInstruction = processingInstructions.find((instruction) => instruction.shouldProcessNode(node));

    if (processingInstruction != null) {
      const traversedChildren = [...node.childNodes].map((child, i) =>
        traverseDom(child, isValidNode, processingInstructions, i),
      );
      const children = traversedChildren.filter((x) => x != null && x !== false);

      if (processingInstruction.replaceChildren) {
        return createElement(node as Element, index, null, [processingInstruction.processNode(node, children, index)]);
      }
      return processingInstruction.processNode(node, children, index);
    }

    return false;
  }

  return false;
}

function traverseWithInstructions(
  nodes: NodeList,
  isValidNode: (node: Node) => boolean,
  processingInstructions: ProcessingInstruction<unknown>[],
): ReactNode | ReactNode[] {
  const list = [...nodes].map((domTreeItem, index) =>
    traverseDom(domTreeItem, isValidNode, processingInstructions, index),
  );
  return list.length <= 1 ? list[0] : list;
}

function buildProcessingInstructions(componentMap: ComponentMap): ProcessingInstruction<unknown>[] {
  return [
    ...AUTHENTICATION_LINK_PROCESSING_INSTRUCTIONS,
    {
      shouldProcessNode: (node) => nodeIsElement(node) && node.nodeName.toLowerCase() === 'a',
      processNode: processCmsLinkNode,
    },
    {
      shouldProcessNode: (node) => nodeIsElement(node) && node.attributes.getNamedItem('data-react-class') != null,
      processNode: (node: Element, children: ReactNode[], index: number) =>
        processReactComponentNode(node, children, index, componentMap),
    },
    {
      shouldProcessNode: () => true,
      processNode: processDefaultNode,
    },
  ];
}

export default function parsePageContent(
  content: string,
  componentMap: ComponentMap = DEFAULT_COMPONENT_MAP,
): { bodyComponents: ReactNode; headComponents: ReactNode } {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');
  const processingInstructions = buildProcessingInstructions(componentMap);
  const bodyComponents = traverseWithInstructions(
    doc.body.childNodes,
    IsValidNodeDefinitions.alwaysValid,
    processingInstructions,
  );
  const headComponents = traverseWithInstructions(
    doc.head.childNodes,
    IsValidNodeDefinitions.alwaysValid,
    processingInstructions,
  );
  return { bodyComponents, headComponents };
}
