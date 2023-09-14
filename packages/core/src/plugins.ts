import anthropicPlugin from './plugins/anthropic/index.js';
import autoevalsPlugin from './plugins/autoevals/index.js';
import assemblyAiPlugin from './plugins/assemblyAi/index.js';
import { huggingFacePlugin } from './plugins/huggingface/plugin.js';
import pineconePlugin from './plugins/pinecone/index.js';
import { oobaboogaPlugin } from './plugins/oobabooga/plugin.js';
export { anthropicPlugin, autoevalsPlugin, assemblyAiPlugin, pineconePlugin, huggingFacePlugin, oobaboogaPlugin };

export const plugins = {
  anthropic: anthropicPlugin,
  autoevals: autoevalsPlugin,
  assemblyAi: assemblyAiPlugin,
  pinecone: pineconePlugin,
  huggingFace: huggingFacePlugin,
  oobabooga: oobaboogaPlugin
};
