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
  CircularProgress,
  Button,
} from "@mui/material";
import {
  fetchStudents,
  fetchAttendanceRecords,
  saveStudentAttendance,
} from "../../api/firebaseDB";
import NotificationSnackbar from "../../components/Common/NotificationSnackbar";

const currentDate = new Date();
const currentMonthName = currentDate.toLocaleString("default", {
  month: "long",
});

const currentYear = currentDate.getFullYear();
const TOTAL_DAYS = new Date(
  new Date().getFullYear(),
  new Date().getMonth() + 1,
  0
).getDate();

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  //  Fetch students + attendance records
  const loadData = async () => {
    try {
      setLoading(true);
      const [studentsData, attendanceData] = await Promise.all([
        fetchStudents(),
        fetchAttendanceRecords(),
      ]);

      //  Sort students by roll number (ascending)
      const sortedStudents = [...studentsData].sort(
        (a, b) => a.rollNumber - b.rollNumber
      );

      //  Merge student list with attendance data
      const merged = sortedStudents.map((stu) => ({
        ...stu,
        attendance:
          attendanceData[stu.id]?.attendance || Array(TOTAL_DAYS).fill(""),
      }));

      setStudents(merged);
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: "Failed to load attendance data.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  //  Toggle attendance (P/A)
  const handleMark = (studentId, dayIndex) => {
    setStudents((prev) =>
      prev.map((stu) =>
        stu.id === studentId
          ? {
              ...stu,
              attendance: stu.attendance.map((val, i) =>
                i === dayIndex ? (val === "P" ? "A" : "P") : val
              ),
            }
          : stu
      )
    );
  };

  //  Save attendance to Firebase
  const handleSave = async () => {
    try {
      await Promise.all(
        students.map((stu) =>
          saveStudentAttendance(stu.id, {
            name: stu.name,
            rollNumber: stu.rollNumber,
            grade: stu.grade,
            attendance: stu.attendance,
          })
        )
      );

      setSnackbar({
        open: true,
        message: "Attendance saved successfully!",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to save attendance.",
        severity: "error",
      });
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        {`${currentMonthName} ${currentYear} Attendance Sheet`}
      </Typography>

      <Paper sx={{ p: 2, overflowX: "auto" }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center">S.No</TableCell>
                <TableCell align="center" sx={{ minWidth: 150 }}>
                  Name
                </TableCell>
                <TableCell align="center">Class</TableCell>
                {Array.from({ length: TOTAL_DAYS }, (_, i) => (
                  <TableCell key={i} align="center">
                    {i + 1}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {students.map((stu) => (
                <TableRow key={stu.id}>
                  <TableCell align="center">{stu.rollNumber}</TableCell>
                  <TableCell align="center" sx={{ minWidth: 150 }}>
                    {stu.name}
                  </TableCell>
                  <TableCell align="center">{stu.grade}</TableCell>

                  {Array.from({ length: TOTAL_DAYS }, (_, i) => (
                    <TableCell
                      key={i}
                      align="center"
                      onClick={() => handleMark(stu.id, i)}
                      sx={{
                        cursor: "pointer",
                        backgroundColor:
                          stu.attendance[i] === "P"
                            ? "#c8e6c9"
                            : stu.attendance[i] === "A"
                            ? "#ffcdd2"
                            : "",
                      }}
                    >
                      {stu.attendance[i] || "-"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box textAlign="right" mt={2}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save Attendance
          </Button>
        </Box>
      </Paper>

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

export default Attendance;
