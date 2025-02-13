import {
  type ChartNode,
  type NodeId,
  type NodeInputDefinition,
  type PortId,
  type NodeOutputDefinition,
} from '../NodeBase.js';
import { nanoid } from 'nanoid/non-secure';
import { NodeImpl, type NodeUIData } from '../NodeImpl.js';
import { nodeDefinition } from '../NodeDefinition.js';
import { type Inputs, type Outputs } from '../GraphProcessor.js';
import { type EditorDefinition } from '../../index.js';
import { dedent } from 'ts-dedent';
import { coerceType } from '../../utils/coerceType.js';
import { toMarkdown } from 'mdast-util-to-markdown';
import { gfmTableToMarkdown } from 'mdast-util-gfm-table';

export type ToMarkdownTableNode = ChartNode<'toMarkdownTable', ToMarkdownTableNodeData>;

export type ToMarkdownTableNodeData = {
  includeHeaders?: boolean;
  alignPipes?: boolean;
};

export class ToMarkdownTableNodeImpl extends NodeImpl<ToMarkdownTableNode> {
  static create(): ToMarkdownTableNode {
    const chartNode: ToMarkdownTableNode = {
      type: 'toMarkdownTable',
      title: 'To Markdown Table',
      id: nanoid() as NodeId,
      visualData: {
        x: 0,
        y: 0,
        width: 200,
      },
      data: {
        includeHeaders: true,
        alignPipes: false,
      },
    };

    return chartNode;
  }

  getInputDefinitions(): NodeInputDefinition[] {
    return [
      {
        id: 'data' as PortId,
        title: 'Data Array',
        dataType: 'any',
        required: true,
      },
    ];
  }

  getOutputDefinitions(): NodeOutputDefinition[] {
    return [
      {
        id: 'markdown' as PortId,
        title: 'Markdown Table',
        dataType: 'string',
      },
    ];
  }

  getEditors(): EditorDefinition<ToMarkdownTableNode>[] {
    return [
      {
        type: 'toggle',
        label: 'Include Headers',
        dataKey: 'includeHeaders',
      },
      {
        type: 'toggle',
        label: 'Align Pipes',
        dataKey: 'alignPipes',
      },
    ];
  }

  getBody(): string | undefined {
    const parts = [];
    if (this.data.includeHeaders) parts.push('Headers');
    if (this.data.alignPipes) parts.push('Aligned');
    return parts.length > 0 ? parts.join(', ') : undefined;
  }

  static getUIData(): NodeUIData {
    return {
      infoBoxBody: dedent`
        Converts an array of objects into a markdown table format.
        Input should be an array of objects with consistent keys.
      `,
      infoBoxTitle: 'To Markdown Table Node',
      contextMenuTitle: 'To Markdown Table',
      group: ['Text'],
    };
  }

  async process(inputs: Inputs): Promise<Outputs> {
    const data = coerceType(inputs['data' as PortId], 'object[]');

    const keys = data.length === 0 ? [] : Object.keys(data[0]!);

    const markdownTable = toMarkdown(
      {
        type: 'table',
        children: [
          ...(this.data.includeHeaders
            ? [
                {
                  type: 'tableRow',
                  children: keys.map((key) => ({ type: 'tableCell', children: [{ type: 'text', value: key }] })),
                },
              ]
            : []),
          ...data.map((row) => ({
            type: 'tableRow' as const,
            children: keys.map((key) => ({
              type: 'tableCell' as const,
              children: [{ type: 'text' as const, value: `${row[key]}` }],
            })),
          })),
        ],
      },
      {
        extensions: [gfmTableToMarkdown({ tablePipeAlign: this.data.alignPipes })],
      },
    );

    return {
      ['markdown' as PortId]: {
        type: 'string',
        value: markdownTable,
      },
    };
  }
}

export const toMarkdownTableNode = nodeDefinition(ToMarkdownTableNodeImpl, 'To Markdown Table');
