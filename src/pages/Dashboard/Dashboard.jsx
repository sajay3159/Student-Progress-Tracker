import { useSelector } from "react-redux";
import { Box, Grid, Paper, Typography, Card, CardContent } from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import SchoolIcon from "@mui/icons-material/School";

const Dashboard = () => {
  const email = useSelector((state) => state.auth.email);

  const stats = [
    {
      title: "Total Students",
      value: 120,
      icon: <PeopleIcon fontSize="large" color="primary" />,
    },
    {
      title: "Average Attendance",
      value: "92%",
      icon: <AssignmentTurnedInIcon fontSize="large" color="success" />,
    },
    {
      title: "Average Marks",
      value: "78%",
      icon: <BarChartIcon fontSize="large" color="warning" />,
    },
    {
      title: "Top Performer",
      value: "John Doe",
      icon: <SchoolIcon fontSize="large" color="secondary" />,
    },
  ];

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Welcome back, {email || "User"}
      </Typography>

      <Typography variant="body1" color="text.secondary" mb={4}>
        Here’s an overview of student performance and attendance.
      </Typography>

      {/* Statistic cards */}
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid key={index}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: 3,
                transition: "0.3s",
                "&:hover": { boxShadow: 6, transform: "scale(1.03)" },
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      {stat.title}
                    </Typography>
                    <Typography variant="h5" fontWeight={600}>
                      {stat.value}
                    </Typography>
                  </Box>
                  {stat.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Placeholder for charts */}
      <Paper
        sx={{
          mt: 4,
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Performance Overview
        </Typography>
        <Typography color="text.secondary">Chart coming soon...</Typography>
      </Paper>
    </Box>
  );
};

export default Dashboard;
