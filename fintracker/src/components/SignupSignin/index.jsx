import React, { useState } from 'react'
import "./styles.css"
import Input from "../Input"
import { EmailAuthProvider } from 'firebase/auth'
import Button from "../Button"
import {createUserWithEmailAndPassword} from "firebase/auth"
import {auth} from "../../firebase"
import { toast } from 'react-toastify'

function SignupSigninComponent() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading]= useState(false);

    function signupWithEmail(){
      setLoading(true);
  console.log("Name", name);
  console.log("Email", email);
  console.log("Password", password);
  console.log("Confirm password", confirmPassword);

  //authentication or basically creating a new accnt for the user
  if(name!= "" && email!= "" && password!= "" && confirmPassword!= ""){
    if(password==confirmPassword){
      createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    console.log("User>>", user);
    toast.success("User Created");
    setLoading(false);
    //after user created, set all to empty again
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    createDoc(user);
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    toast.error(errorMessage);
    setLoading(false);
    // ..
  });
    }
    else{
      toast.error("Password and Confirm Password don'nt match");
      setLoading(false);
    }
  }else{
    toast.error("All fields are mandatory!")
    setLoading(false);
  }
}

function createDoc(user){
  //making sure that doc with the particular uid(unique) doesn't exist
  //then creating the doc
}

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
         <Input type="email"
        label={"Email"} 
        state={email} 
        setState= {setEmail} 
        placeholder={"Your Mail ID"}
        />
         <Input type="password"
        label={"Password"} 
        state={password} 
        setState= {setPassword} 
        placeholder={"Your password"}
        />
         <Input type="password"
        label={"Confirm Password"} 
        state={confirmPassword} 
        setState= {setConfirmPassword} 
        placeholder={"Confirm your password"}
        />
        <Button 
        disabled = {loading}
        text={loading ? "Loading..." : "SignUp using Email and Password"} 
          onClick={signupWithEmail}/>
        <p style={{textAlign: "center", margin: 0}}> OR </p>
        <Button text={loading ? "Loading..." : "SignUp using Google"} blue={true}/>
    </form>
    </div>
  )
}

export default SignupSigninComponent
