import React, { useState } from 'react'
import "./styles.css"
import Input from "../Input"
import { EmailAuthProvider } from 'firebase/auth'
import Button from "../Button";

function SignupSigninComponent() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

  return (
    <div className='signup-wrapper'>
    <h2 className='title'>
        Sign Up on <span style={{color : "var(--theme)"}}>FinTracker</span>
    </h2>
    <form>
        <Input 
        label={"Full Name"} 
        state={name} 
        setState= {setName} 
        placeholder={"Your Name"}
        />
         <Input 
        label={"Email"} 
        state={email} 
        setState= {setEmail} 
        placeholder={"Your Mail ID"}
        />
         <Input 
        label={"Password"} 
        state={password} 
        setState= {setPassword} 
        placeholder={"Your password"}
        />
         <Input 
        label={"Confirm Password"} 
        state={confirmPassword} 
        setState= {setConfirmPassword} 
        placeholder={"Confirm your password"}
        />
        <Button text={"SignUp using Email and Password"}/>
        <p style={{textAlign: "center", margin: 0}}> OR </p>
        <Button text={"SignUp using Google"} blue={true}/>
    </form>
    </div>
  )
}

export default SignupSigninComponent
