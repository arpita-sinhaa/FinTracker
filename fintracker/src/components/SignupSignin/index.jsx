import React, { useState } from "react";
import "./styles.css";
import Input from "../Input";
import {
  EmailAuthProvider,
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import Button from "../Button";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const provider = new GoogleAuthProvider();

function SignupSigninComponent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginForm, setLoginForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function signupWithEmail() {
    setLoading(true);
    console.log("Name", name);
    console.log("Email", email);
    console.log("Password", password);
    console.log("Confirm password", confirmPassword);

    //authentication or basically creating a new accnt for the user
    if (name != "" && email != "" && password != "" && confirmPassword != "") {
      if (password == confirmPassword) {
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
            navigate("/dashboard");
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            toast.error(errorMessage);
            setLoading(false);
            setConfirmPassword("");
            setEmail("");
            setName("");
            setPassword("");
          });
      } else {
        toast.error("Password and Confirm Password don't match");
        setLoading(false);
      }
    } else {
      toast.error("All fields are mandatory!");
      setLoading(false);
    }
  }

  function loginUsingEmail() {
    console.log("Email", email);
    console.log("password", password);

    setLoading(true);

    if (email != "" && password != "") {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          toast.success("User logged In");
          console.log("user logged in", user);
          setLoading(false);
          navigate("/dashboard");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setLoading(false);
          toast.error(errorMessage);
        });
    } else {
      toast.error("All fields are mandatory");
      setLoading(false);
    }
  }

  async function createDoc(user) {
    setLoading(true);
    //making sure that doc with the particular uid(unique) doesn't exist
    //then creating the doc
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);

    if (!userData.exists()) {
      try {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName ? user.displayName : name,
          email: user.email,
          photoURL: user.photoURL ? user.photoURL : "",
          createdAt: new Date(),
        });
        toast.success("Doc created");
        setLoading(false);
      } catch (e) {
        toast.error(e.message);
        setLoading(false);
      }
    } else {
      toast.error("Doc already exists");
      setLoading(false);
    }
  }

  async function googleAuth() {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);

      const user = result.user;
      console.log("user>>", user);
      toast.success("User authenticated");

      // create Firestore doc for this user
      await createDoc(user);

      navigate("/dashboard");
    } catch (e) {
      console.error(e);
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {loginForm ? (
        <div className="signup-wrapper">
          <h2 className="title">
            Login on on{" "}
            <span style={{ color: "var(--theme)" }}>FinTracker</span>
          </h2>
          <form>
            <Input
              type="email"
              label={"Email"}
              state={email}
              setState={setEmail}
              placeholder={"Your Mail ID"}
            />

            <Input
              type="password"
              label={"Password"}
              state={password}
              setState={setPassword}
              placeholder={"Your password"}
            />

            <Button
              disabled={loading}
              text={loading ? "Loading..." : "Login using Email and Password"}
              onClick={loginUsingEmail}
            />
            <p className="p-login"> OR </p>
            <Button
              onClick={googleAuth}
              text={loading ? "Loading..." : "Login using Google"}
              blue={true}
            />
            <p
              className="p-login"
              style={{ cursor: "pointer" }}
              onClick={() => setLoginForm(!loginForm)}
            >
              {" "}
              Or Don't Have An Account ? Click Here{" "}
            </p>
          </form>
        </div>
      ) : (
        <div className="signup-wrapper">
          <h2 className="title">
            Sign Up on <span style={{ color: "var(--theme)" }}>FinTracker</span>
          </h2>
          <form>
            <Input
              label={"Full Name"}
              state={name}
              setState={setName}
              placeholder={"Your Name"}
            />
            <Input
              type="email"
              label={"Email"}
              state={email}
              setState={setEmail}
              placeholder={"Your Mail ID"}
            />
            <Input
              type="password"
              label={"Password"}
              state={password}
              setState={setPassword}
              placeholder={"Your password"}
            />
            <Input
              type="password"
              label={"Confirm Password"}
              state={confirmPassword}
              setState={setConfirmPassword}
              placeholder={"Confirm your password"}
            />
            <Button
              disabled={loading}
              text={loading ? "Loading..." : "SignUp using Email and Password"}
              onClick={signupWithEmail}
            />
            <p className="p-login"> OR </p>
            <Button
              onClick={googleAuth}
              text={loading ? "Loading..." : "SignUp using Google"}
              blue={true}
            />
            <p
              className="p-login"
              style={{ cursor: "pointer" }}
              onClick={() => setLoginForm(!loginForm)}
            >
              {" "}
              Or Have An Account Already ? Click Here{" "}
            </p>
          </form>
        </div>
      )}
    </>
  );
}

export default SignupSigninComponent;
