import { useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  CircularProgress,
  Link as MuiLink,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/authSlice";
import { loginUser } from "../../api/firebaseAuth";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../Firebase";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const emailRef = useRef();
  const passwordRef = useRef();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const forgetPasswordHandler = () => {
    navigate("/forget");
  };

  // Email / Password Login
  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await loginUser(email, password);
      dispatch(
        authActions.login({
          token: data.idToken,
          email: data.email,
          uid: data.localId,
        })
      );

      setSuccess("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
      emailRef.current.value = "";
      passwordRef.current.value = "";
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      dispatch(
        authActions.login({
          token: await user.getIdToken(),
          email: user.email,
          uid: user.uid,
        })
      );

      setSuccess("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Google login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 6,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h5" textAlign="center" mb={2}>
            Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email Address"
              type="email"
              inputRef={emailRef}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Password"
              type="password"
              inputRef={passwordRef}
              fullWidth
              margin="normal"
              required
            />

            {error && (
              <Typography variant="body2" color="error" textAlign="center">
                {error}
              </Typography>
            )}
            {success && (
              <Typography
                variant="body2"
                color="success.main"
                textAlign="center"
              >
                {success}
              </Typography>
            )}

            <Box mt={3}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                sx={{ borderRadius: 5 }}
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </Box>

            <Box mt={2} textAlign="center">
              <MuiLink
                component="button"
                onClick={forgetPasswordHandler}
                underline="hover"
                color="primary"
              >
                Forget Password?
              </MuiLink>
            </Box>
          </form>
          <Typography
            textAlign="center"
            variant="subtitle2"
            mt={2}
            mb={1}
            color="text.secondary"
          >
            OR
          </Typography>
          {/* Google Sign-In */}
          <Box mt={2}>
            <Button
              variant="outlined"
              fullWidth
              onClick={handleGoogleLogin}
              disabled={loading}
              sx={{
                borderRadius: 5,
                textTransform: "none",
                py: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                backgroundColor: "white",
                borderColor: "#dadce0",
                "&:hover": { backgroundColor: "#f7f7f7" },
              }}
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                width={22}
                height={22}
              />
              <span>Sign in with Google</span>
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Signup */}
      <Card variant="outlined" sx={{ backgroundColor: "#c3dbcf" }}>
        <CardContent>
          <Typography textAlign="center">
            Don't have an account?{" "}
            <Link component={Link} to="/signup" underline="hover" color="blue">
              Sign up
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;
