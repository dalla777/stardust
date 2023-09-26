import { EditorProvider } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import * as Y from 'yjs'
import { HocuspocusProvider } from '@hocuspocus/provider'
import MenuBar from './MenuBar'
import './editor.css'

const ydoc = new Y.Doc(); // grab from db

const provider = new HocuspocusProvider({
  url: "ws://0.0.0.0:1234",
  name: "example-document-room-id",
  document: ydoc,
});

const extensions = [
  StarterKit.configure({
    history: false,
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
  Collaboration.configure({
    document: ydoc,
  }),
  CollaborationCursor.configure({
    provider,
    user: { name: "John Doe", color: "#ffcc00" },
  }),
]

const content = `
<h2>
  Hi there,
</h2>
<p>
  this is a <em>basic</em> example of <strong>tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
</p>
<ul>
  <li>
    That’s a bullet list with one …
  </li>
  <li>
    … or two list items.
  </li>
</ul>
<p>
  Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
</p>
<pre><code class="language-css">body {
display: none;
}</code></pre>
<p>
  I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
</p>
<blockquote>
  Wow, that’s amazing. Good work, boy! 👏
  <br />
  — Mom
</blockquote>
`

const Editor = () => {
  return (
    <EditorProvider slotBefore={<MenuBar />} extensions={extensions} content={content} children={null} />
  )
}

export default Editor