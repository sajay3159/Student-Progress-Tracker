import { useRef, useState } from "react";
import {
  Container,
  TextField,
  Button,
  CircularProgress,
  Box,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "../../api/firebaseAuth";

const ForgetPage = () => {
  const navigate = useNavigate();
  const emailInputRef = useRef();
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnack = () => setSnack({ ...snack, open: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const enteredEmail = emailInputRef.current.value;

    try {
      await sendPasswordResetEmail(enteredEmail);

      setSnack({
        open: true,
        message: "Password reset link sent to your email.",
        severity: "success",
      });

      navigate("/login");
    } catch (err) {
      setSnack({
        open: true,
        message: err.message || "Please enter a valid email",
        severity: "error",
      });
    } finally {
      setLoading(false);
      emailInputRef.current.value = "";
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
        <Typography variant="h6" align="center">
          Enter the email with which you have registered
        </Typography>

        <TextField
          label="Email"
          type="email"
          inputRef={emailInputRef}
          fullWidth
          required
          disabled={loading}
          margin="normal"
        />

        <Box textAlign="center" mt={2}>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ width: "50%" }}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Sending...
              </>
            ) : (
              "Send Link"
            )}
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={handleCloseSnack}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnack}
          severity={snack.severity}
          sx={{ width: "100%" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ForgetPage;
