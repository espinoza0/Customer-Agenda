import { Route, Routes } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import CustomerPage from './pages/CustomerPage'
import AgendaPage from './pages/AgendaPage'
import { Toaster } from './components/ui/toaster'


function App() {

  return (
    <>
      <Toaster/>
      <Routes>
        <Route path='/' element={<LoginPage/>}/>
        <Route path='/home' element={<HomePage/>}/>
        <Route path='/customers' element={<CustomerPage/>}/>
        <Route path='/agenda' element={<AgendaPage/>}/>
      </Routes>
    </>
  )
}

export default App
