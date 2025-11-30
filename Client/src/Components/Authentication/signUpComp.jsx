import {useState} from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom' // Ensure this is from 'react-router-dom'

// --- PASSWORD VALIDATOR FUNCTION ---
// Requires: minimum 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
const isStrongPassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+[\]{};':"\\|,.<>/?]/.test(password);
    
    return (
        password.length >= minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumber &&
        hasSpecialChar
    );
};
// -----------------------------------

function SignUp(){
    const [email,setEmail] = useState('') // Initialize state to empty string
    const [password,setPassword] = useState('')
    const [confirm,setConfirm]= useState('')
    const navigate = useNavigate()
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState(null) // State for displaying validation/server errors

    async function handleSubmit(e){
        e.preventDefault()
        setError(null) // Clear previous errors
        
        // --- 1. Basic Field Check (Improved) ---
        if(!email || !password || !confirm){
            setError('All fields are required.');
            return; // Stop execution
        }

        // --- 2. Password Match Check ---
        if(password !== confirm){
            setError('Password mismatch. Please provide identical passwords.');
            return; // Stop execution
        }
        
        // --- 3. Password Strength Check ---
        if(!isStrongPassword(password)){
            setError('Password is too weak. Must be at least 8 characters and include: 1 uppercase, 1 lowercase, 1 number, and 1 special character.');
            return; // Stop execution
        }

        setLoading(true)
        try{
            const response = await axios.post('http://localhost:15150/signup',{email,password,confirm})

            if(response.status === 201){
                // Using alert for success is okay, but consider a toast/popup in a real app
                alert(response.data.message)
                navigate('/')
            }
        }catch(error){
            console.error(error)
            // Use response from server for specific error messages
            const errorMessage = error.response?.data?.message || 'Failed to create account. Please try again.';
            setError(errorMessage);
        }finally{
            setLoading(false)
        }
    }

    return(
        <>
         <form onSubmit={handleSubmit} className='Signup-form'>
            <h2><span>S</span>ign <span>U</span>p</h2>
            {/* Display error message */}
            {error && <p style={{color: 'red'}}>{error}</p>} 
            
            <input type="email" placeholder='Enter Email' value={email} onChange={(e) => setEmail(e.target.value)} required/>
            <br />
            <input type="password" placeholder='Enter Password' value={password} onChange={(e)=>  setPassword(e.target.value)} required />
            <br />
            <input type="password" placeholder='Confirm Password' value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
            <br />
            <button disabled={loading} id='signup-button'>
                {loading? 'Signing Up...':'Sign Up'}
            </button>
         </form>
        </>
    )
}
export default SignUp