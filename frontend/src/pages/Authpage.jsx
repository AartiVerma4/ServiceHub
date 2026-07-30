import React, { useState } from "react";
import authImg from "../assets/auth.jpg";
export default function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true);
  return (
    <div className="container my-5">
      <div className="row align-items-center justify-content-center">
        <div className="col-md-6">
          <img src={authImg} className="img-fluid rounded mb-3" alt="Auth Banner" />
        </div>
        <div className="col-md-6">
          <div className="card p-4">
            <div className="d-flex justify-content-between mb-3">
             <button
  className={`btn ${isSignIn ? 'btn-primary' : 'btn-light'}`}
  onClick={() => setIsSignIn(true)}
>
  Sign In
</button>

<button
  className={`btn ${!isSignIn ? 'btn-primary' : 'btn-light'}`}
  onClick={() => setIsSignIn(false)}
>
  Sign Up
</button>
            </div>
            {isSignIn ? (
              <>
                <h4>Welcome Back!</h4>
                <input type="email" className="form-control mb-2" placeholder="Email Address" />
                <input type="password" className="form-control mb-2" placeholder="Password" />
                <button className="btn btn-success w-100 mb-2">Sign In as Customer</button>
                <button className="btn btn-outline-primary w-100">Sign In as Provider</button>
              </>
            ) : (
              <>
                <h4>Join ServiceHub Today!</h4>
                <input type="email" className="form-control mb-2" placeholder="Email Address" />
                <input type="password" className="form-control mb-2" placeholder="Password" />
                <input type="password" className="form-control mb-2" placeholder="Confirm Password" />
                <button className="btn btn-success w-100 mb-2">Create Customer Account</button>
                <button className="btn btn-outline-primary w-100">Register as Provider</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}