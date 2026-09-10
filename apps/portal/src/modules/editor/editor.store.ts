export const editorStore = {
  activeTool: "select",
  setTool(tool: string) {
    this.activeTool = tool;
  }
};
