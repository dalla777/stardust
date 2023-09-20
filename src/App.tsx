import './App.css'
import Editor from './components/Editor'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom"

// TODO: create a home dashboard with create new button + list of user's docs
function Home() {
  return (<h1>Hello world</h1>)
}

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/documents/:id" element={<Editor />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
