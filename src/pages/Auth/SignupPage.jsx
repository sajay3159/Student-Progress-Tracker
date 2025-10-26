import { useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  CircularProgress,
  Link as MuiLink,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../../api/firebaseAuth";

const SignupPage = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      await signupUser(email, password);
      setSuccess("Signup successful");
      setError("");
      navigate("/login");
    } catch (err) {
      setError(err.message || "Signup failed");
      setSuccess("");
    } finally {
      setLoading(false);
      emailRef.current.value = "";
      passwordRef.current.value = "";
      confirmPasswordRef.current.value = "";
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
          <Typography variant="h5" align="center" mb={3}>
            Sign Up
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
            <TextField
              label="Confirm Password"
              type="password"
              inputRef={confirmPasswordRef}
              fullWidth
              margin="normal"
              required
            />

            {error && (
              <Typography variant="body2" color="error" align="center">
                {error}
              </Typography>
            )}
            {success && (
              <Typography variant="body2" color="success.main" align="center">
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
                    Signing up...
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ backgroundColor: "#c3dbcf" }}>
        <CardContent>
          <Typography align="center">
            Have an account?{" "}
            <MuiLink
              component={Link}
              to="/login"
              underline="hover"
              color="blue"
            >
              Login
            </MuiLink>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SignupPage;
