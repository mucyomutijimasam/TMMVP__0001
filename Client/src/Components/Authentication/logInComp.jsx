import {useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import '../../Styles/form.css'

function LogIn(){
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error,setError] = useState(null) // State for displaying errors

    async function handleSubmit(e){
        e.preventDefault()
        setLoading(true)
        setError(null) // Clear previous errors

        try{
            const response = await axios.post('http://localhost:15150/login',{email,password})
            
            // Log in is successful (status 200)
            if(response.status === 200){
                const {token, user, message} = response.data;
                
                // --- Store the JWT Token securely ---
                localStorage.setItem('authToken', token);
                // Optionally store user info (e.g., user.id)
                localStorage.setItem('user', JSON.stringify(user));

                alert(message);
                navigate('/dashboard');
            } else {
                // Should not typically happen if server sends 200/40x/500, but as a fallback:
                navigate('/signup');
            }
        }catch(error){
            console.error(error)
            // Use server-side error message if available
            const errorMessage = error.response?.data?.message || 'Network error or server not reachable. Please try again.';
            setError(errorMessage)
        }finally{
            setLoading(false)
        }
    }
    return(
        <>
          <form onSubmit={handleSubmit} className='Signup-form'>
            <h2><span>L</span>og<span>I</span>n</h2>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <input type="email" placeholder='Enter Email Address' value={email} onChange={(e)=> setEmail(e.target.value)} required />
            <br />
            <input type="password" placeholder='Enter password' value={password} onChange={(e)=> setPassword(e.target.value)} required/>
            <br />
            <button disabled={loading} id='signup-button'>
                {loading ? 'Logging In...' : 'Log In'}
            </button>
          </form>
        </>
    )
}

export default LogIn    