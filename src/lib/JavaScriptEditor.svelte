<script>
  import { onMount } from "svelte";
  import { get, writable } from "svelte/store";
  import { javascript } from "@codemirror/lang-javascript";
  import { EditorState } from "@codemirror/state";
  import {
    EditorView,
    keymap,
    highlightSpecialChars,
    drawSelection,
    highlightActiveLine,
    highlightActiveLineGutter,
    lineNumbers
  } from "@codemirror/view";
  import { defaultKeymap, indentWithTab } from "@codemirror/commands";
  import { syntaxHighlighting, defaultHighlightStyle } from "@codemirror/language";

  import { myVariable } from '$lib/stores/editorStore';

  let editorDiv;
  let editor; // speichern wir hier rein

  onMount(() => {
    const state = EditorState.create({
      doc: get(myVariable),
      extensions: [
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightSpecialChars(),
        drawSelection(),
        highlightActiveLine(),
        keymap.of([indentWithTab, ...defaultKeymap]),
        javascript(),
        syntaxHighlighting(defaultHighlightStyle),
        EditorView.editable.of(true),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const newText = update.state.doc.toString();
            myVariable.set(newText);
          }
        })
      ]
    });

    editor = new EditorView({
      state,
      parent: editorDiv
    });

    // reagiere auf spätere Änderungen am Store (z. B. bei neuem Level)
    myVariable.subscribe((newCode) => {
      const currentText = editor.state.doc.toString();
      if (newCode !== currentText) {
        editor.dispatch({
          changes: {
            from: 0, 
            to: editor.state.doc.length,
            insert: newCode
          }
        });
      }
    });
  });
</script>

<div class="editor" bind:this={editorDiv}></div>
