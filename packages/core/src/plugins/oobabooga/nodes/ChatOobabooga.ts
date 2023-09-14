import { nanoid } from 'nanoid';
import {
  ChartNode,
  EditorDefinition,
  Inputs,
  InternalProcessContext,
  NodeBodySpec,
  NodeId,
  NodeImpl,
  NodeInputDefinition,
  NodeOutputDefinition,
  NodeUIData,
  Outputs,
  PortId,
  getInputOrData,
  nodeDefinition,
} from '../../../index.js';

import OobaboogaAPI from '../helpers/Oobabooga.js'

export type OobaboogaChatNodeData = {
  model: string;
  prompt: string;
  useModelInput?: boolean;
  usePromptInput?: boolean;
};

export type OobaboogaChatNode = ChartNode<'oobaboogaChat', OobaboogaChatNodeData>;

export class OobaboogaChatNodeImpl extends NodeImpl<OobaboogaChatNode> {

  api = new OobaboogaAPI()

  static create(): OobaboogaChatNode {
    return {
      id: nanoid() as NodeId,
      type: 'oobaboogaChat',
      data: {
        model: '',
        prompt: '',
      },
      title: 'Oobabooga Chat',
      visualData: {
        x: 0,
        y: 0,
        width: 300,
      },
    };
  }

  static getUIData(): NodeUIData {
    return {
      group: ['AI', 'Oobabooga'],
      contextMenuTitle: 'Oobabooga Chat',
      infoBoxTitle: 'Oobabooga Chat Node',
      infoBoxBody: 'Chat using the Oobabooga API',
    };
  }

  getInputDefinitions(): NodeInputDefinition[] {

    const inputs: NodeInputDefinition[] = [
      {
        id: 'prompt' as PortId,
        dataType: 'string',
        title: 'Prompt',
        required: true,
      },
    ];
    
    return inputs;
  }

  getOutputDefinitions(): NodeOutputDefinition[] {
    return [
      {
        id: 'output' as PortId,
        dataType: 'string',
        title: 'Output',
      },
    ];
  }

  getEditors(): EditorDefinition<OobaboogaChatNode>[] {
    return [
      {
        type: 'string',
        label: 'Prompt',
        dataKey: 'prompt',
        useInputToggleDataKey: 'usePromptInput',
      },
    ];
  }

  getBody(): string | NodeBodySpec | NodeBodySpec[] | undefined {
    return `Send chat to Oobabooga API`;
  }

  async process(inputData: Inputs, context: InternalProcessContext): Promise<Outputs> {
    const prompt = getInputOrData(this.data, inputData, 'prompt');

    const api = new OobaboogaAPI(); 
    let result = await api.run(prompt) as string;

    if (result == null) { result = 'Error' }

    return {
      ['output' as PortId]: {
        type: 'string',
        value: result
      },
    };
  }
}

export const oobaboogaChatNode = nodeDefinition(OobaboogaChatNodeImpl, 'Oobabooga Chat');
