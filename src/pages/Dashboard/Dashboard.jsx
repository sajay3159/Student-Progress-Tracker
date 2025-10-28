import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import BarChartIcon from "@mui/icons-material/BarChart";
import SchoolIcon from "@mui/icons-material/School";
import { fetchStudents, fetchAttendanceRecords } from "../../api/firebaseDB";

const Dashboard = () => {
  const email = useSelector((state) => state.auth.email);

  const [stats, setStats] = useState({
    totalStudents: 0,
    avgAttendance: "0%",
  });
  const [loading, setLoading] = useState(true);

  //  Fetch student and attendance data
  const loadStudentData = async () => {
    try {
      const [studentsData, attendanceData] = await Promise.all([
        fetchStudents(),
        fetchAttendanceRecords(),
      ]);

      const totalStudents = studentsData.length;

      // Average attendance
      let totalDays = 0;
      let totalPresent = 0;

      Object.values(attendanceData || {}).forEach((record) => {
        const attArray = record.attendance || [];
        attArray.forEach((val) => {
          if (val === "P") totalPresent++;
          if (val === "P" || val === "A") totalDays++;
        });
      });

      const avgAttendance =
        totalDays > 0
          ? `${Math.round((totalPresent / totalDays) * 100)}%`
          : "0%";

      setStats({ totalStudents, avgAttendance });
    } catch (error) {
      console.error("Dashboard data error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudentData();
  }, []);

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

  //  Stats cards
  const cards = [
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: <PeopleIcon fontSize="large" color="primary" />,
    },
    {
      title: "Average Attendance",
      value: stats.avgAttendance,
      icon: <AssignmentTurnedInIcon fontSize="large" color="success" />,
    },
    {
      title: "Average Marks",
      value: "Coming Soon",
      icon: <BarChartIcon fontSize="large" color="warning" />,
    },
    {
      title: "Reports",
      value: "Coming Soon",
      icon: <SchoolIcon fontSize="large" color="secondary" />,
    },
  ];

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Welcome back, {email || "Teacher"}
      </Typography>

      <Typography variant="body1" color="text.secondary" mb={4}>
        Here’s a quick overview of your school data.
      </Typography>

      {/* Cards Section */}
      <Grid container spacing={3}>
        {cards.map((item, index) => (
          <Grid key={index} item xs={12} sm={6} md={3}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: 3,
                textAlign: "center",
                transition: "0.3s",
                "&:hover": { boxShadow: 6, transform: "scale(1.05)" },
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mb: 1,
                  }}
                >
                  {item.icon}
                </Box>
                <Typography variant="subtitle2" color="text.secondary">
                  {item.title}
                </Typography>
                <Typography variant="h6" fontWeight={600}>
                  {item.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper
        sx={{
          mt: 4,
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Performance Overview
        </Typography>
        <Typography color="text.secondary">
          Graphs and detailed analytics coming soon...
        </Typography>
      </Paper>
    </Box>
  );
};

export default Dashboard;
