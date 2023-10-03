import {
  useCallback, useEffect,
  useState,
} from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import CharacterCount from '@tiptap/extension-character-count'
import * as Y from 'yjs'
import { HocuspocusProvider, HocuspocusProviderWebsocket } from '@hocuspocus/provider'
import MenuBar from './MenuBar'
import './editor.css'

const ydoc = new Y.Doc(); // grab from db

const websocketProvider = new HocuspocusProvider({
  url: "ws://127.0.0.1:80",
  name: "example-document-room-id",
  document: ydoc
});

const colors = ['#958DF1', '#F98181', '#FBBC88', '#FAF594', '#70CFF8', '#94FADB', '#B9F18D']
const getRandomElement = (list: string[]) => list[Math.floor(Math.random() * list.length)]
const getRandomColor = () => {
  return getRandomElement(colors)
}
const getInitialUser = () => {
  const stored = localStorage.getItem('currentUser');
  return stored ? JSON.parse(stored) : {
    name: '',
    color: getRandomColor(),
  }
}

const Editor = () => {
  const [status, setStatus] = useState('connecting')
  const [currentUser, setCurrentUser] = useState(getInitialUser)

  const setName = useCallback(() => {
    const name = (window.prompt('Name') || '').trim().substring(0, 32)

    if (name) {
      return setCurrentUser({ ...currentUser, name })
    }
  }, [currentUser])

  const editor = useEditor({
    extensions: [
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
      CharacterCount.configure({
        limit: 10000,
      }),
      Collaboration.configure({
        document: ydoc,
      }),
      CollaborationCursor.configure({
        provider: websocketProvider,
      }),
    ]
  })

  useEffect(() => {
    // Update status changes
    const statusChange = (event: HocuspocusProviderWebsocket) => setStatus(event.status);
    websocketProvider.on('status', statusChange);
    websocketProvider.off('status', statusChange);
  }, [])

  useEffect(() => {
    if (editor && currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser))
      editor.chain().focus().updateUser(currentUser).run()
    }
  }, [editor, currentUser])

  return (
    <>
      {editor && <MenuBar editor={editor} />}
      <EditorContent className="editor__content" editor={editor} />
      <div className="editor__footer">
        <div className={`editor__status editor__status--${status}`}>
          {status === 'connected'
            ? `${editor?.storage.collaborationCursor.users.length} user${editor?.storage.collaborationCursor.users.length === 1 ? '' : 's'} online`
            : 'offline'}
        </div>
        <div>
          {currentUser.name && <span className="editor__username">{currentUser.name}</span>}
          <button onClick={setName}>{currentUser.name ? 'Change your name' : 'Add your name'}</button>
        </div>
      </div>
    </>
  )
}

export default Editor