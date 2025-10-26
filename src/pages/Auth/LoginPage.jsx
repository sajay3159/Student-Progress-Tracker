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
      navigate("/home");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
      emailRef.current.value = "";
      passwordRef.current.value = "";
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
      <Box mt={2}>
        <Card variant="outlined">
          <CardContent sx={{ textAlign: "center" }}>
            <Typography variant="body2">Want to login as Admin?</Typography>
            <Button
              variant="text"
              color="primary"
              onClick={() =>
                (window.location.href =
                  "https://restaurant-admin-panel-nine.vercel.app")
              }
            >
              Admin Login
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default LoginPage;
