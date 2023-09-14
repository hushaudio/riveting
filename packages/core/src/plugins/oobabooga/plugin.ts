import { RivetPlugin } from '../../index.js';
import { oobaboogaChatNode } from './nodes/ChatOobabooga.js';
import { oobaboogaLoadedModelNode } from './nodes/CurrentOobaboogaModel.js';
import { oobaboogaModelLoaderNode } from './nodes/LoadOobabooga.js';

export const oobaboogaPlugin: RivetPlugin = {
  id: 'oobabooga',
  name: 'Oobabooga API',

  configSpec: {
    oobaboogaURL: {
      type: 'string',
      label: 'Oobabooga API URL',
      description: 'Your Oobabooga API Base URL.',
      pullEnvironmentVariable: 'OOBABOOGA_API_URL',
      helperText: 'Create at https://huggingface.co/settings/tokens',
    },
    oobaboogaModels: {
      type: 'string',
      label: 'Oobabooga Models Folder',
      description: 'The folder your Oobabooga models are stored in.',
    },
    oobaboogaAPIKey: {
      type: 'string',
      label: 'Oobabooga API URL',
      description: 'Your Oobabooga API Base URL.',
      pullEnvironmentVariable: 'OOBABOOGA_API_URL',
      helperText: 'Create at https://huggingface.co/settings/tokens',
    },
    oobaboogaPort: {
      type: 'string',
      label: 'Oobabooga API URL',
      description: 'Your Oobabooga API Base URL.',
      pullEnvironmentVariable: 'OOBABOOGA_API_URL',
      helperText: 'Create at https://huggingface.co/settings/tokens',
    },
  },

  contextMenuGroups: [
    {
      id: 'oobabooga',
      label: 'Oobabooga API',
    },
  ],

  register(register) {
    register(oobaboogaChatNode);
    register(oobaboogaModelLoaderNode);
    register(oobaboogaLoadedModelNode);
  },
};
