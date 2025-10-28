import { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  Container,
  Snackbar,
  Alert,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const DATABASE_URL =
  "https://student-progress-tracker-54108-default-rtdb.firebaseio.com/users/";

const Profile = () => {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.uid);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const fetchProfileData = async () => {
    try {
      const response = await fetch(`${DATABASE_URL}${userId}.json`);
      const data = await response.json();
      if (data) {
        setName(data.name || "");
        setPhone(data.phone || "");
        setAddress(data.address || "");
      }
    } catch (error) {
      setError("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setError("");

      const profileData = {
        name,
        phone,
        address,
      };

      const response = await fetch(`${DATABASE_URL}${userId}.json`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile data");
      }

      setSnackbarMessage("Profile saved successfully!");
      setOpenSnackbar(true);
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Update Profile
      </Typography>

      <TextField
        label="Full Name"
        variant="outlined"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{ marginBottom: 2 }}
      />

      <TextField
        label="Phone Number"
        variant="outlined"
        fullWidth
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        sx={{ marginBottom: 2 }}
      />

      <TextField
        label="Address"
        variant="outlined"
        fullWidth
        multiline
        rows={3}
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        sx={{ marginBottom: 3 }}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        sx={{ padding: "10px 20px" }}
      >
        Save
      </Button>

      {error && (
        <Typography color="error" mt={2}>
          {error}
        </Typography>
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile;
