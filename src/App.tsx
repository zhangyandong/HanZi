import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import CharacterDetail from './pages/CharacterDetail'
import { CharacterProvider } from './context/CharacterContext'

function App() {
  return (
    <CharacterProvider>
      <Router>
        <div className="w-full h-full overflow-hidden">
          <Routes>
            <Route path="/" element={<CharacterDetail />} />
            <Route path="/detail/:char" element={<CharacterDetail />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </CharacterProvider>
  )
}

export default App