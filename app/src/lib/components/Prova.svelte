<script lang="ts">
    import { Text } from 'svelte-tweakpane-ui';
    let { value } = $props();

    function updateValue(index: number, newValue: number) {
        const updatedValue = [...value]; // Crea una nuova copia dell'array
        updatedValue[index] = newValue; // Aggiorna l'elemento specifico
        value = updatedValue; // Assegna il nuovo valore
        console.log('Valore aggiornato in Prova:', value);
    }
</script>

<Text value={value[0]} label="Min" on:input={(e) => updateValue(0, e.detail)} />
<Text value={value[1]} label="Max" on:input={(e) => updateValue(1, e.detail)} />