
import { useState } from 'react'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { signup, login } from '../store/user.action.js'


function getEmptyCredentials() {
    return {
        fullname: '',
        username: 'puki',
        password: '123',
    }
}

export function LoginSignup({ setUser }) {

    const [credentials, setCredentials] = useState(getEmptyCredentials())
    const [isSignupState, setIsSignupState] = useState(false)

    function handleCredentialsChange(ev) {
        const field = ev.target.name
        const value = ev.target.value
        setCredentials((prevCreds) => ({ ...prevCreds, [field]: value }))
    }

    async function onSubmit(ev) {
        ev.preventDefault()
        const func = isSignupState ? signup : login
        try {
            const user = await func(credentials)
            showSuccessMsg(`Welcome ${user.fullname}`)
        } catch (err) {
            showErrorMsg('OOps try again')
        }
    }

    function onToggleSignupState() {
        setIsSignupState(!isSignupState)
    }

    const { username, password, fullname } = credentials
    return <div className="login-page">

        <form className="login-form" onSubmit={onSubmit}>
            <input
                type="text"
                name="username"
                value={username}
                placeholder="Username"
                onChange={handleCredentialsChange}
                required
                autoFocus
            />

            <input
                type="password"
                name="password"
                value={password}
                placeholder="Password"
                onChange={handleCredentialsChange}
                required
            />

            {isSignupState && <input
                type="text"
                name="fullname"
                value={fullname}
                placeholder="Full name"
                onChange={handleCredentialsChange}
                required
            />}

            <button className='login-btn'>{isSignupState ? 'Signup' : 'Login'}</button>
            <button className='signup-btn'>
                <a href="#" onClick={onToggleSignupState}>
                    {isSignupState ? 'Login' : 'Signup'}
                </a >
            </button>
        </form>

        <div className="btns">
        </div>
    </div >

}

