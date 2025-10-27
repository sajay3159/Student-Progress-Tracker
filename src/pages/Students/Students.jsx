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
  updateStudent,
} from "../../store/studentsSlice";
import { createAttendanceRecord } from "../../api/firebaseDB";
import NotificationSnackbar from "../../components/Common/NotificationSnackbar";

const Students = () => {
  const dispatch = useDispatch();
  const { list, status } = useSelector((state) => state.students);

  const [newStudent, setNewStudent] = useState({
    id: null,
    name: "",
    email: "",
    grade: "",
    rollNumber: "",
    phone: "",
    address: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    dispatch(getStudents());
  }, [dispatch]);

  const handleChange = (e) => {
    setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
  };

  // ✅ Add or Update student
  const handleSubmit = async () => {
    if (!newStudent.name || !newStudent.grade || !newStudent.rollNumber) {
      setSnackbar({
        open: true,
        message: "Please fill all required fields",
        severity: "error",
      });
      return;
    }

    try {
      if (isEditing) {
        // Update existing student
        await dispatch(updateStudent(newStudent)).unwrap();
        setSnackbar({
          open: true,
          message: "Student updated successfully!",
          severity: "success",
        });
      } else {
        // Add new student
        const result = await dispatch(createStudent(newStudent)).unwrap();

        // Create attendance record
        await createAttendanceRecord(result.id, {
          name: result.name,
          rollNumber: result.rollNumber,
          grade: result.grade,
          attendance: {},
        });

        setSnackbar({
          open: true,
          message: "Student added successfully!",
          severity: "success",
        });
      }

      // Reset form
      setNewStudent({
        id: null,
        name: "",
        email: "",
        grade: "",
        rollNumber: "",
        phone: "",
        address: "",
      });
      setIsEditing(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Operation failed.",
        severity: "error",
      });
    }
  };

  const handleEdit = (student) => {
    setNewStudent(student);
    setIsEditing(true);
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

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Students
      </Typography>

      {/* Add / Edit Form */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {isEditing ? "Edit Student" : "Add New Student"}
        </Typography>
        <Grid container spacing={2}>
          <Grid>
            <TextField
              label="Name"
              fullWidth
              name="name"
              value={newStudent.name}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid>
            <TextField
              label="Email"
              fullWidth
              name="email"
              value={newStudent.email}
              onChange={handleChange}
            />
          </Grid>
          <Grid>
            <TextField
              label="Grade/Class"
              fullWidth
              name="grade"
              value={newStudent.grade}
              onChange={handleChange}
            />
          </Grid>
          <Grid>
            <TextField
              label="Roll Number"
              fullWidth
              name="rollNumber"
              value={newStudent.rollNumber}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid>
            <TextField
              label="Phone Number"
              fullWidth
              name="phone"
              value={newStudent.phone}
              onChange={handleChange}
            />
          </Grid>
          <Grid>
            <TextField
              label="Address"
              fullWidth
              name="address"
              value={newStudent.address}
              onChange={handleChange}
            />
          </Grid>
          <Grid>
            <Button
              variant="contained"
              color={isEditing ? "success" : "primary"}
              onClick={handleSubmit}
            >
              {isEditing ? "Update Student" : "Add Student"}
            </Button>
            {isEditing && (
              <Button
                sx={{ ml: 2 }}
                variant="outlined"
                color="secondary"
                onClick={() => {
                  setIsEditing(false);
                  setNewStudent({
                    id: null,
                    name: "",
                    email: "",
                    grade: "",
                    rollNumber: "",
                    phone: "",
                    address: "",
                  });
                }}
              >
                Cancel
              </Button>
            )}
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
                    <TableCell>{student.phone || "—"}</TableCell>
                    <TableCell>{student.address || "—"}</TableCell>
                    <TableCell>
                      <Button
                        color="primary"
                        onClick={() => handleEdit(student)}
                      >
                        Edit
                      </Button>
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

      {/* Snackbar */}
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
