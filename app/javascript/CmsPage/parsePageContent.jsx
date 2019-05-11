import React, { lazy, Suspense } from 'react';
import camelCase from 'lodash-es/camelCase';
import IsValidNodeDefinitions from 'html-to-react/lib/is-valid-node-definitions';
import camelCaseAttrMap from 'html-to-react/lib/camel-case-attribute-names';
import SignInButton from '../Authentication/SignInButton';

const ProposeEventButton = lazy(() => import(/* webpackChunkName: 'propose-event-button' */ '../EventProposals/ProposeEventButton'));
const WithdrawMySignupButton = lazy(() => import(/* webpackChunkName: 'withdraw-my-signup-button' */ '../EventsApp/EventPage/WithdrawMySignupButton'));

const REACT_COMPONENTS_BY_NAME = {
  ProposeEventButton,
  WithdrawMySignupButton,
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

function createElement(node, index, data, children) {
  const attributeProps = [...node.attributes].reduce((result, attribute) => {
    const key = jsxAttributeKeyForHtmlKey(attribute.name);
    if (key === 'style') {
      return { ...result, [key]: createStyleJsonFromString(attribute.value) };
    }

    return { ...result, [key]: attribute.value || attribute.name };
  }, {});

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

function processSignInLinkNode(node) {
  return (
    <SignInButton
      className={(node.attributes.class || {}).value || 'btn btn-link d-inline p-0'}
      caption={node.textContent}
    />
  );
}

function processReactComponentNode(node, children, index) {
  const component = REACT_COMPONENTS_BY_NAME[node.attributes['data-react-class'].value];
  if (!component) {
    return processDefaultNode(node, children, index);
  }

  const props = JSON.parse((node.attributes['data-react-props'] || { value: '{}' }).value);
  return React.createElement(
    Suspense,
    { fallback: (<></>) },
    React.createElement(component, props),
  );
}

function traverseDom(node, isValidNode, processingInstructions, index) {
  if (isValidNode(node)) {
    const processingInstruction = processingInstructions.find(instruction => (
      instruction.shouldProcessNode(node)
    ));

    if (processingInstruction != null) {
      const traversedChildren = [...node.childNodes].map((child, i) => (
        traverseDom(child, isValidNode, processingInstructions, i)
      ));
      const children = traversedChildren.filter(x => x != null && x !== false);

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

export default function parsePageContent(content) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');
  const components = traverseWithInstructions(
    doc.body.children,
    IsValidNodeDefinitions.alwaysValid,
    [
      {
        shouldProcessNode: node => (
          node.nodeType === Node.ELEMENT_NODE
          && node.nodeName.toLowerCase() === 'a'
          && node.attributes.href.value.endsWith('/users/sign_in')
        ),
        processNode: processSignInLinkNode,
      },
      {
        shouldProcessNode: node => node.nodeType === Node.ELEMENT_NODE && node.attributes['data-react-class'],
        processNode: processReactComponentNode,
      },
      {
        shouldProcessNode: () => true,
        processNode: processDefaultNode,
      },
    ],
  );
  return components;
}
