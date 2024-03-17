import { Input, IterMode, NodeProp, NodeType, SyntaxNode, Tree, TreeCursor } from '@lezer/common';

class StringInput implements Input {
  constructor(readonly string: string) {}

  get length() {
    return this.string.length;
  }

  chunk(from: number) {
    return this.string.slice(from);
  }

  // eslint-disable-next-line class-methods-use-this
  get lineChunks() {
    return false;
  }

  read(from: number, to: number) {
    return this.string.slice(from, to);
  }
}

enum Color {
  Red = 31,
  Green = 32,
  Blue = 34,
}

function colorize(value: unknown, color: number): string {
  return `\u001b[${color}m${String(value)}\u001b[39m`;
}

function focusedNode(cursor: TreeCursor): {
  readonly type: NodeType;
  readonly from: number;
  readonly to: number;
} {
  const { type, from, to } = cursor;
  return { type, from, to };
}

export function printTree(
  initialCursor: TreeCursor | Tree | SyntaxNode | ((mode?: IterMode) => TreeCursor),
  initialInput: Input | string,
  options: { from?: number; to?: number; start?: number; includeParents?: boolean } = {},
): string {
  const cursor: TreeCursor =
    initialCursor instanceof TreeCursor
      ? initialCursor
      : typeof initialCursor === 'function'
        ? initialCursor()
        : initialCursor instanceof Tree
          ? initialCursor.cursor()
          : initialCursor.cursor();
  let input = initialInput;
  if (typeof input === 'string') input = new StringInput(input);
  const { from = -Infinity, to = Infinity, start = 0, includeParents = false } = options;
  let output = '';
  const prefixes: string[] = [];
  for (;;) {
    const node = focusedNode(cursor);
    const mounted = node.type.prop(NodeProp.mounted);
    if (mounted) {
      output += printTree(mounted.tree, input.read(node.from, node.to));
    }
    let leave = false;
    if (node.from <= to && node.to >= from) {
      const enter = !node.type.isAnonymous && (includeParents || (node.from >= from && node.to <= to));
      if (enter) {
        leave = true;
        const isTop = output === '';
        if (!isTop || node.from > 0) {
          output += (!isTop ? '\n' : '') + prefixes.join('');
          const hasNextSibling = cursor.nextSibling() && cursor.prevSibling();
          if (hasNextSibling) {
            output += ' ├─ ';
            prefixes.push(' │  ');
          } else {
            output += ' └─ ';
            prefixes.push('    ');
          }
        }
        output += node.type.isError ? colorize(node.type.name, Color.Red) : node.type.name;
      }
      const isLeaf = !cursor.firstChild();
      if (enter) {
        const hasRange = node.from !== node.to;
        output += ` ${
          hasRange
            ? `[${colorize(start + node.from, Color.Blue)}..${colorize(start + node.to, Color.Blue)}]`
            : colorize(start + node.from, Color.Blue)
        }`;
        if (hasRange && isLeaf) {
          output += `: ${colorize(JSON.stringify(input.read(node.from, node.to)), Color.Green)}`;
        }
      }
      // eslint-disable-next-line no-continue
      if (!isLeaf) continue;
    }
    for (;;) {
      if (leave) prefixes.pop();
      leave = cursor.type.isAnonymous;
      if (cursor.nextSibling()) break;
      if (!cursor.parent()) return output;
      leave = true;
    }
  }
}

export function logTree(
  tree: TreeCursor | Tree | SyntaxNode,
  input: Input | string,
  options: { from?: number; to?: number; start?: number; includeParents?: boolean } = {},
): void {
  // eslint-disable-next-line no-console
  console.log(printTree(tree, input, options));
}
