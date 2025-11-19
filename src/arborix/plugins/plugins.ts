import { TreeInstance } from "../types";

export class PluginManager {
  private plugins: Array<{ plugin: any; teardown?: () => void }> = [];

  install(tree: TreeInstance, plugin: any) {
    const teardown = plugin.setup(tree);
    this.plugins.push({ plugin, teardown });
  }

  destroy() {
    this.plugins.forEach(p => p.teardown?.());
    this.plugins = [];
  }
} 