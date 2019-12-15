import React, { Suspense } from 'react';
import camelCase from 'lodash-es/camelCase';
import IsValidNodeDefinitions from 'html-to-react/lib/is-valid-node-definitions';
import camelCaseAttrMap from 'html-to-react/lib/camel-case-attribute-names';
import { Link } from 'react-router-dom';

import ErrorBoundary from './ErrorBoundary';
import SignInButton from './Authentication/SignInButton';
import SignOutButton from './Authentication/SignOutButton';
import SignUpButton from './Authentication/SignUpButton';
import Spoiler from './Spoiler';

export const DEFAULT_COMPONENT_MAP = {
  Spoiler,
  SignInButton,
  SignOutButton,
  SignUpButton,
};

// adapted from html-to-react library

const voidElementTags = [
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param',
  'source', 'track', 'wbr', 'menuitem', 'textarea',
];

function createStyleJsonFromString(style) {
  const styleString = style || '';
  const styles = styleString.split(/;(?!base64)/);
  let singleStyle;
  let key;
  let value;
  const jsonStyles = {};
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
      jsonStyles[camelCase(key)] = value;
    }
  }
  return jsonStyles;
}

function jsxAttributeKeyForHtmlKey(htmlKey) {
  const key = camelCaseAttrMap[htmlKey.replace(/[-:]/, '')] || htmlKey;

  if (key === 'class') {
    return 'className';
  }

  if (key === 'for') {
    return 'htmlFor';
  }

  return key;
}

function jsxAttributesFromHTMLAttributes(attributes) {
  return attributes.reduce((result, attribute) => {
    const key = jsxAttributeKeyForHtmlKey(attribute.name);
    if (key === 'style') {
      return { ...result, [key]: createStyleJsonFromString(attribute.value) };
    }

    return { ...result, [key]: attribute.value || attribute.name };
  }, {});
}

function createElement(node, index, data, children) {
  const attributeProps = jsxAttributesFromHTMLAttributes([...node.attributes]);

  const elementProps = {
    key: index,
    ...attributeProps,
  };

  const allChildren = data != null ? [data, ...children] : [...children];
  return React.createElement(node.nodeName.toLowerCase(), elementProps, ...allChildren);
}

function processDefaultNode(node, children, index) {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent;
  }

  if (node.nodeType === Node.COMMENT_NODE) {
    // FIXME: The following doesn't work as the generated HTML results in
    // "&lt;!--  This is a comment  --&gt;"
    // return '<!-- ' + node.data + ' -->';
    return false;
  }

  if (voidElementTags.includes(node.nodeName)) {
    return createElement(node, index);
  }

  return createElement(node, index, node.data, children);
}

const AUTHENTICATION_LINK_REPLACEMENTS = {
  '/users/sign_in': (node) => (
    <SignInButton
      className={(node.attributes.class || {}).value || 'btn btn-link d-inline p-0'}
      caption={node.textContent}
    />
  ),
  '/users/sign_up': (node) => (
    <SignUpButton
      className={(node.attributes.class || {}).value || 'btn btn-primary btn-sm'}
      caption={node.textContent}
    />
  ),
  '/users/sign_out': (node) => (
    <SignOutButton
      className={(node.attributes.class || {}).value}
      caption={node.textContent}
    />
  ),
};

const AUTHENTICATION_LINK_PROCESSING_INSTRUCTIONS = Object.entries(AUTHENTICATION_LINK_REPLACEMENTS)
  .map(([path, processNode]) => ({
    shouldProcessNode: (node) => (
      node.nodeType === Node.ELEMENT_NODE
      && node.nodeName.toLowerCase() === 'a'
      && ((node.attributes.href || {}).value || '').endsWith(path)
    ),
    processNode,
  }));

function processReactComponentNode(node, children, index, componentMap) {
  const component = componentMap[node.attributes['data-react-class'].value];
  if (!component) {
    return processDefaultNode(node, children, index);
  }

  const props = JSON.parse((node.attributes['data-react-props'] || { value: '{}' }).value);
  return React.createElement(
    Suspense,
    { fallback: (<></>), key: index },
    React.createElement(
      ErrorBoundary,
      { errorType: 'graphql' },
      React.createElement(component, props),
    ),
  );
}

function processCmsLinkNode(node, children, index) {
  const attributesArray = [...node.attributes];
  const hrefAttribute = attributesArray
    .find((attribute) => (attribute.name || '').toLowerCase() === 'href');
  const otherAttributes = attributesArray
    .filter((attribute) => (attribute.name || '').toLowerCase() !== 'href');
  const href = (hrefAttribute || {}).value;

  if (href && !href.startsWith('#') && (new URL(href, window.location.href).origin === window.location.origin)) {
    return (
      <Link
        to={href}
        key={index}
        {...jsxAttributesFromHTMLAttributes(otherAttributes)}
      >
        {children}

      </Link>
    );
  }

  return processDefaultNode(node, children, index);
}

function traverseDom(node, isValidNode, processingInstructions, index) {
  if (isValidNode(node)) {
    const processingInstruction = processingInstructions.find((instruction) => (
      instruction.shouldProcessNode(node)
    ));

    if (processingInstruction != null) {
      const traversedChildren = [...node.childNodes].map((child, i) => (
        traverseDom(child, isValidNode, processingInstructions, i)
      ));
      const children = traversedChildren.filter((x) => x != null && x !== false);

      if (processingInstruction.replaceChildren) {
        return createElement(node, index, null, [
          processingInstruction.processNode(node, children, index),
        ]);
      }
      return processingInstruction.processNode(node, children, index);
    }

    return false;
  }

  return false;
}

function traverseWithInstructions(nodes, isValidNode, processingInstructions) {
  const list = [...nodes].map((domTreeItem, index) => (
    traverseDom(domTreeItem, isValidNode, processingInstructions, index)
  ));
  return list.length <= 1 ? list[0] : list;
}

function buildProcessingInstructions(componentMap) {
  return [
    ...AUTHENTICATION_LINK_PROCESSING_INSTRUCTIONS,
    {
      shouldProcessNode: (node) => node.nodeType === Node.ELEMENT_NODE && node.nodeName.toLowerCase() === 'a',
      processNode: processCmsLinkNode,
    },
    {
      shouldProcessNode: (node) => node.nodeType === Node.ELEMENT_NODE && node.attributes['data-react-class'],
      processNode: (node, children, index) => (
        processReactComponentNode(node, children, index, componentMap)
      ),
    },
    {
      shouldProcessNode: () => true,
      processNode: processDefaultNode,
    },
  ];
}

export default function parsePageContent(content, componentMap = DEFAULT_COMPONENT_MAP) {
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
