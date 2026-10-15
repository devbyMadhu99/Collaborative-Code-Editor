
import "../App.css";

function AuthForm({
  isLogin,
  setIsLogin,
  username,
  setUsername,
  email,
  setEmail,
  password,
  setPassword,
  handleAuth,
}) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        
<h1 className="auth-title">
  &lt;CodeSync /&gt;
</h1>

<p className="auth-subtitle">
  {isLogin
    ? "Welcome back! Sign in to continue coding."
    : "Create your account and start coding together."}
</p>

<h2>{isLogin ? "Login" : "Register"}</h2>

        <form onSubmit={handleAuth} className="auth-form">
          {!isLogin && (
            <input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="auth-switch">
          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}{" "}

          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthForm;
