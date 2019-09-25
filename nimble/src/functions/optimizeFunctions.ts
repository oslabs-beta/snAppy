import { WorkspaceEdit, workspace, Position } from "vscode";

export const uncommentFunc = (uri: any, line: number) => {
  //will use that and the starting position to comment out static imports by using workspaceEdit.insert(URI, position, string)
  let edit = new WorkspaceEdit();
  console.log("line", line);
  edit.insert(uri, new Position(line-1, 0), "//");
  workspace.applyEdit(edit)
  .then(res => console.log("edited", res));
};
