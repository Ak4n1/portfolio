import { Plugin } from 'prosemirror-state';
import { Slice, Fragment } from 'prosemirror-model';
import type { ResolvedPos } from 'prosemirror-model';
import type { EditorView } from 'prosemirror-view';

/**
 * Plugin que preserva los saltos de línea al pegar texto plano.
 * Cada línea se convierte en un párrafo.
 */
export function pastePreserveNewlinesPlugin(): Plugin {
  return new Plugin({
    props: {
      clipboardTextParser(text: string, $context: ResolvedPos, _plainText: boolean, view: EditorView) {
        const schema = view.state.schema;
        const marks = $context.marks();
        const lines = text.split(/\r\n?|\n/);
        const nodes = lines.map((line) => {
          const content = line ? [schema.text(line, marks)] : [];
          return schema.node('paragraph', null, content);
        });
        const fragment = Fragment.from(nodes);
        return new Slice(fragment, 0, 0);
      }
    }
  });
}
