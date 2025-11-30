import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import SignUp from './Components/Authentication/signUpComp'
import LogIn from './Components/Authentication/logInComp'

function App() {

  return (
    <>
      <Router>

        <Routes>
            <Route path='/signup' element={<SignUp/>}/>
            <Route path='/' element={<LogIn/>}/>


        </Routes>


      </Router>
    </>
  )
}

export default App
