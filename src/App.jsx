import { Route, Routes } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import CustomerPage from './pages/CustomerPage'


function App() {

  return (
    <Routes>
      <Route path='/' element={<LoginPage/>}/>
      <Route path='/home' element={<HomePage/>}/>
      <Route path='/customers' element={<CustomerPage/>}/>
      <Route path='/agenda'/>

    </Routes>
  )
}

export default App
