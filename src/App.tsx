import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import InputPage from './pages/InputPage'
import CharacterDetail from './pages/CharacterDetail'
import { CharacterProvider } from './context/CharacterContext'

function App() {
  return (
    <CharacterProvider>
      <Router>
        <div className="w-full h-full overflow-hidden">
          <Routes>
            <Route path="/" element={<InputPage />} />
            <Route path="/list" element={<CharacterDetail />} />
            <Route path="/detail/:char" element={<CharacterDetail />} />
          </Routes>
        </div>
      </Router>
    </CharacterProvider>
  )
}

export default App