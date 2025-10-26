import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Grid,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  getStudents,
  createStudent,
  removeStudent,
} from "../../store/studentsSlice";
import NotificationSnackbar from "../../components/Common/NotificationSnackbar";

const Students = () => {
  const dispatch = useDispatch();
  const { list, status } = useSelector((state) => state.students);

  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    grade: "",
    rollNumber: "",
    attendance: "",
    phone: "",
    address: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleChange = (e) => {
    setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
  };

  const handleAddStudent = async () => {
    if (!newStudent.name || !newStudent.grade || !newStudent.rollNumber) {
      setSnackbar({
        open: true,
        message: "Please fill all required fields",
        severity: "error",
      });
      return;
    }

    try {
      await dispatch(createStudent(newStudent)).unwrap();
      setSnackbar({
        open: true,
        message: "Student added successfully!",
        severity: "success",
      });
      setNewStudent({
        name: "",
        email: "",
        grade: "",
        rollNumber: "",
        attendance: "",
        phone: "",
        address: "",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to add student.",
        severity: "error",
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(removeStudent(id)).unwrap();
      setSnackbar({
        open: true,
        message: "Student deleted successfully!",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to delete student.",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    dispatch(getStudents());
  }, [dispatch]);

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Students
      </Typography>

      {/* Add Form */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Add New Student
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Name"
              fullWidth
              name="name"
              value={newStudent.name}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Email"
              fullWidth
              name="email"
              value={newStudent.email}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Grade/Class"
              fullWidth
              name="grade"
              value={newStudent.grade}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Roll Number"
              fullWidth
              name="rollNumber"
              value={newStudent.rollNumber}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Attendance (%)"
              fullWidth
              name="attendance"
              value={newStudent.attendance}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Phone Number"
              fullWidth
              name="phone"
              value={newStudent.phone}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={8}>
            <TextField
              label="Address"
              fullWidth
              name="address"
              value={newStudent.address}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" onClick={handleAddStudent}>
              Add Student
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Students Table */}
      {status === "loading" ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "30vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Grade</TableCell>
                <TableCell>Roll No</TableCell>
                <TableCell>Attendance</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No students found.
                  </TableCell>
                </TableRow>
              ) : (
                list.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.email || "—"}</TableCell>
                    <TableCell>{student.grade}</TableCell>
                    <TableCell>{student.rollNumber}</TableCell>
                    <TableCell>{student.attendance || "—"}</TableCell>
                    <TableCell>{student.phone || "—"}</TableCell>
                    <TableCell>{student.address || "—"}</TableCell>
                    <TableCell>
                      <Button
                        color="error"
                        onClick={() => handleDelete(student.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <NotificationSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </Box>
  );
};

export default Students;
