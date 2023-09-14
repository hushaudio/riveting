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

export type OobaboogaModelLoaderNodeData = {
  model: string;
  prompt: string;
  useModelInput?: boolean;
  usePromptInput?: boolean;
};

export type OobaboogaModelLoaderNode = ChartNode<'oobaboogaModelLoader', OobaboogaModelLoaderNodeData>;

export class OobaboogaModelLoaderNodeImpl extends NodeImpl<OobaboogaModelLoaderNode> {

  api = new OobaboogaAPI()

  static create(): OobaboogaModelLoaderNode {
    return {
      id: nanoid() as NodeId,
      type: 'oobaboogaModelLoader',
      data: {
        model: '',
        prompt: '',
      },
      title: 'Oobabooga Model Loader',
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
      contextMenuTitle: 'Oobabooga Model Loader',
      infoBoxTitle: 'Oobabooga Model Loader Node',
      infoBoxBody: 'Oobabooga Model Loader',
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
        title: 'Success',
      },
    ];
  }

  async getEditors(): Promise<EditorDefinition<OobaboogaModelLoaderNode>[]> {
    const data = await this.api.listModels()
    console.log({loadingEditorsWithModels: data});
    return [
      {
        type: 'dropdown',
        label: 'Model',
        dataKey: 'model',
        useInputToggleDataKey: 'useModelInput',
        options: data.map((model:string) => ({ value: model, label: model })),
      }
    ];
  }

  getBody(): string | NodeBodySpec | NodeBodySpec[] | undefined {
    return `Load Oobabooga Model: ${this.data?.model || "none"}`;
  }

  async process(inputData: Inputs, context: InternalProcessContext): Promise<Outputs> {
    const model = getInputOrData(this.data, inputData, 'model');

    if(!model) return {
      ['output' as PortId]: {
        type: 'boolean',
        value: true
      },
    };

    const api = new OobaboogaAPI(); 

    let result = await api.modelLoad(model);
    
    if (result == null) { return {
        ['output' as PortId]: {
          type: 'boolean',
          value: false
        },
      }; 
    }

    return {
      ['output' as PortId]: {
        type: 'boolean',
        value: true
      },
    };
  }
}

export const oobaboogaModelLoaderNode = nodeDefinition(OobaboogaModelLoaderNodeImpl, 'Oobabooga Model Loader');
