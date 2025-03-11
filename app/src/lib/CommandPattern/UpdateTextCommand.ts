// src/lib/commands/UpdateTextCommand.js
import type { Writable } from "svelte/store";

export class UpdateTextCommand {
  private store: Writable<string>;
  private newText: string;
  private previousText: string = "";

  constructor(store: Writable<string>, newText: string) {
    this.store = store;
    this.newText = newText;
  }

  execute() {
    console.log("Eseguo: cambio testo a", this.newText);
    this.store.update(() => this.newText);
  }

  undo() {
    console.log("Undo: ripristino testo a", this.previousText);
    this.store.update(() => this.previousText);
  }
}

  
