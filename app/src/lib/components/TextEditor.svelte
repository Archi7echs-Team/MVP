<script lang="ts">
    import { onDestroy } from 'svelte';
    import { textStore } from '$lib/stores/editStore';
  import { CommandDispatcher } from '$lib/CommandPattern/CommandDispatcher';
  import { UpdateTextCommand } from '$lib/CommandPattern/UpdateTextCommand';

  
    let text = "";
    const dispatcher = new CommandDispatcher();
  
    // Sincronizza lo store con il testo
    $: textStore.subscribe(value => text = value);
  
    function updateText(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    dispatcher.execute(new UpdateTextCommand(textStore, target.value));
  }
  
    function undo() {
      dispatcher.undo();
    }
  
    function redo() {
      dispatcher.redo();
    }
  
    onDestroy(() => {
      textStore.set(""); // Pulizia quando il componente viene rimosso
    });
  </script>
  
  <textarea bind:value={text} on:input={updateText}></textarea>
  <button on:click={undo}>Undo</button>
  <button on:click={redo}>Redo</button>
  