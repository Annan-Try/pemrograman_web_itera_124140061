import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { BookProvider } from './context/BookContext'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home/Home'
import Stats from './pages/Stats/Stats'
import './App.css'

/**
 * BookProvider membungkus seluruh routing supaya data buku (Context API)
 * bisa diakses dari halaman mana saja (Home maupun Stats) tanpa prop drilling.
 */
function App() {
  return (
    <BookProvider>
      <BrowserRouter>
        <div className="app-shell">
          <Navbar />
          <main className="app-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/stats" element={<Stats />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </BookProvider>
  )
}

export default App
