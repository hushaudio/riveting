type LoaModelArgs = {
    loader: string;
    bf16: boolean;
    load_in_8bit: boolean;
    groupsize: number;
    wbits: number;
    threads: number;
    n_batch: number;
    no_mmap: boolean;
    mlock: boolean;
    cache_capacity: null | any;  // Replace 'any' with a more specific type if possible
    n_gpu_layers: number;
    n_ctx: number;
    rwkv_strategy: null | string;
    rwkv_cuda_on: boolean;
  };

export default class OobaboogaAPI {
  private HOST: string;
  private URI: string;
  public models: string[] = []

  constructor() {
      this.HOST = 'localhost:5000';
      this.URI = `http://${this.HOST}/api/v1/generate`;
  }

  // Equivalent to the 'run' function in Python
  async run(prompt: string): Promise<string> {
      const request = {
          prompt,
          max_new_tokens: 2048,
          auto_max_new_tokens: false,
          max_tokens_second: 0,
          preset: 'None',
          do_sample: true,
          temperature: 0.2,
          top_p: 0.1,
          typical_p: 1,
          epsilon_cutoff: 0,
          eta_cutoff: 0,
          tfs: 1,
          top_a: 0,
          repetition_penalty: 1.18,
          repetition_penalty_range: 0,
          top_k: 40,
          min_length: 0,
          no_repeat_ngram_size: 0,
          num_beams: 1,
          penalty_alpha: 0,
          length_penalty: 1,
          early_stopping: false,
          mirostat_mode: 0,
          mirostat_tau: 5,
          mirostat_eta: 0.1,
          guidance_scale: 1,
          negative_prompt: '',
          seed: -1,
          add_bos_token: true,
          truncation_length: 2048,
          ban_eos_token: false,
          skip_special_tokens: true,
          stopping_strings: []
      };
      console.log({request});
      
      const response = await fetch(this.URI, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request),
      });

      if (response.status === 200) {
        const data = await response.json();
        return data.results[0].text
      } else {
        return 'Error'
      }
  }

  // Equivalent to the 'generate' function in Python
  async generate(prompt: string, tokens: number = 200): Promise<string | null> {
      const request = { prompt, max_new_tokens: tokens };
      const response = await fetch(`http://${this.HOST}/api/v1/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request),
      });

      if (response.status === 200) {
          const data = await response.json();
          return data.results[0].text;
      }

      return null;
  }

  // Equivalent to the 'model_api' function in Python
  async modelApi(request: any): Promise<any> {
      const response = await fetch(`http://${this.HOST}/api/v1/model`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request),
      });

      return await response.json() as string[];
  }

  async modelInfo(): Promise<any> {
      return this.modelApi({ action: 'info' });
  }

  async listModels(): Promise<any> {
      return (await this.modelApi({ action: 'list' }))?.result;
  }

  async modelLoad(model_name: string): Promise<any> {
      return this.modelApi({ action: 'load', model_name });
  }

  async complexModelLoad(model: string, args:LoaModelArgs): Promise<any> {
      // Function to guess group size
      const guessGroupsize = (model_name: string): number => {
          if (model_name.includes('1024g')) return 1024;
          if (model_name.includes('128g')) return 128;
          if (model_name.includes('32g')) return 32;
          return -1;
      };

      //TODO: Still some typings to fix here, make more customizable
      let req = {
          action: 'load',
          model_name: model,
          args: Object.assign({
              loader: 'AutoGPTQ',
              bf16: false,
              load_in_8bit: false,
              groupsize: 0,
              wbits: 0,
              threads: 0,
              n_batch: 512,
              no_mmap: false,
              mlock: false,
              cache_capacity: null,
              n_gpu_layers: 0,
              n_ctx: 2048,
              rwkv_strategy: null as null|string,
              rwkv_cuda_on: false,
          }, args)
      };

      model = model.toLowerCase();

      if (model.includes('4bit') || model.includes('gptq') || model.includes('int4')) {
          req.args.wbits = 4;
          req.args.groupsize = guessGroupsize(model);
      } else if (model.includes('3bit')) {
          req.args.wbits = 3;
          req.args.groupsize = guessGroupsize(model);
      }

      if (model.includes('8bit')) {
          req.args.load_in_8bit = true;
      } else if (model.includes('-hf') || model.includes('fp16')) {
          if (model.includes('7b')) {
              req.args.bf16 = true;
          } else if (model.includes('13b')) {
              req.args.load_in_8bit = true;
          }
      } else if (model.includes('gguf')) {
          if (model.includes('7b')) {
              req.args.n_gpu_layers = 100;
          } else if (model.includes('13b')) {
              req.args.n_gpu_layers = 100;
          } else if (model.includes('30b') || model.includes('33b')) {
              req.args.n_gpu_layers = 59;
          } else if (model.includes('65b')) {
              req.args.n_gpu_layers = 42;
          }
      } else if (model.includes('rwkv')) {
          req.args.rwkv_cuda_on = true;
          if (model.includes('14b')) {
              req.args.rwkv_strategy = 'cuda f16i8';
          } else {
              req.args.rwkv_strategy = 'cuda f16';
          }
      }

      return await this.modelApi(req);
  }
}
