import { Command } from './Command';

export class CommandDispatcher {
  private history: Command[] = [];
  private undoStack: Command[] = [];

  execute(command: Command) {
    command.execute();
    this.history.push(command);
    this.undoStack = [];
  }  

  undo() {
    if (this.history.length > 0) {
      const command = this.history.pop()!;
      command.undo();
      this.undoStack.push(command);
    }
  }

  redo() {
    if (this.undoStack.length > 0) {
      const command = this.undoStack.pop()!;
      command.execute();
      this.history.push(command);
    }
  }
}
