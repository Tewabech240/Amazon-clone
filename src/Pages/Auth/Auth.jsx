import React, { useState,useContext} from 'react';
import classes from './SignUp.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { auth} from "../../Utility/firebase";
import {signInWithEmailAndPassword, createUserWithEmailAndPassword} from "firebase/auth"
import { ClipLoader } from 'react-spinners';
import { DataContext } from '../../Components/DataProvider/DataProvider';
import { Type } from "../../Utility/action.type";

// console.log(password, email);

function Auth() {
const [email,setEmail] = useState("");
const [password,setPassword] =useState("");
const [error, setError] = useState("");

const [loading, setLoading] = useState({
  signIn:false, 
  signUp:false,
})

const [{user}, dispatch] = useContext(DataContext)
const navigate = useNavigate()

const authHandler = async (e)=>{
e.preventDefault()
console.log(e.target.name);
if(e.target.name== "signin"){
  // firebase auth
  setLoading({...loading, signIn:true})
  signInWithEmailAndPassword(auth, email, password)
    .then((userInfo) => {
      console.log(userInfo);
      dispatch({
        type: Type.SET_USER,
        user: userInfo.user,
      });
      setLoading({ ...loading, signIn: false });
      navigate("/");
    })
    .catch((err) => {
      setEmail(err.message);
      setLoading({ ...loading, signUp: false });
    });


}else{
   setLoading({ ...loading, signUp: true})
  createUserWithEmailAndPassword(auth, email, password).then((userInfo)=>{
    console.log(userInfo);
dispatch({
  type: Type.SET_USER,
  user: userInfo.user,
});
 setLoading({ ...loading, signUp: false})
 navigate("/")

    }).catch((err)=>{
console.log(err);
setError(err.message);
 setLoading({ ...loading, signUp: false})
    });
}

};

  return (
    <section className={classes.login}>
      {/* logo */}
      <Link>
        <img
          src="https://download.logo.wine/logo/Amazon_(company)/Amazon_(company)-Logo.wine.png"
          alt=""
        />
      </Link>

      {/* form */}
      <div className={classes.login__container}>
        <h1>sign in</h1>
        <form action="">
          <div>
            <label htmlFor="email">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
            />
          </div>

          <button
            type="submit"
            onClick={authHandler}
            name="signin"
            className={classes.login__signInButton}
          >
            {loading.signIn ? (
              <ClipLoader color="#000" size={15}></ClipLoader>
            ) : (
              "sign In"
            )}
            sign In
          </button>
        </form>

        {/* agreement */}

        <p>
          By signing-in you agree to the AMAZON FAKE CLONE conditions of use &
          sale. Please see our Privacy Notice, our cookies Notice and our
          Interest-based Ads Notice.
        </p>

        {/* create account button */}

        <button
          type="submit"
          name="signup"
          onClick={authHandler}
          className={classes.login__registerButton}
        >
          {loading.signUp ? (
            <ClipLoader color="#000" size={15}></ClipLoader>
          ) : (
            " Create your Amazon Account"
          )}
        </button>
        {error && (
          <small style={{ paddingTop: "5px", color: "red" }}>{error}</small>
        )}
      </div>
    </section>
  );
  
}

export default Auth;