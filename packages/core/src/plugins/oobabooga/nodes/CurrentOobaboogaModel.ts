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

export type OobaboogaLoadedModelNodeData = {
  model: string;
  prompt: string;
  useModelInput?: boolean;
  usePromptInput?: boolean;
};

export type OobaboogaLoadedModelNode = ChartNode<'oobaboogaLoadedModel', OobaboogaLoadedModelNodeData>;

export class OobaboogaLoadedModelNodeImpl extends NodeImpl<OobaboogaLoadedModelNode> {

  api = new OobaboogaAPI()

  static create(): OobaboogaLoadedModelNode {
    return {
      id: nanoid() as NodeId,
      type: 'oobaboogaLoadedModel',
      data: {
        model: '',
        prompt: '',
      },
      title: 'Oobabooga Loaded Model',
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
      contextMenuTitle: 'Oobabooga Loaded Model',
      infoBoxTitle: 'Oobabooga Loaded Model Node',
      infoBoxBody: 'Oobabooga Loaded Model',
    };
  }

  getInputDefinitions(): NodeInputDefinition[] {
    return [];
  }

  getOutputDefinitions(): NodeOutputDefinition[] {
    return [
      {
        id: 'output' as PortId,
        dataType: 'string',
        title: 'Model Name',
      },
    ];
  }

  getEditors(): EditorDefinition<OobaboogaLoadedModelNode>[] {
    return [
    ];
  }

  getBody(): string | NodeBodySpec | NodeBodySpec[] | undefined {
    return `Load Oobabooga Model: ${this.data?.model || "none"}`;
  }

  async process(inputData: Inputs, context: InternalProcessContext): Promise<Outputs> {

    const api = new OobaboogaAPI(); 

    let data = await api.modelInfo();
    
    if (data?.result == null) { return {
        ['output' as PortId]: {
          type: 'string',
          value: 'error'
        },
      }; 
    }

    return {
      ['output' as PortId]: {
        type: 'string',
        value: data.result.model_name
      },
    };
  }
}

export const oobaboogaLoadedModelNode = nodeDefinition(OobaboogaLoadedModelNodeImpl, 'Oobabooga Loaded Model');
