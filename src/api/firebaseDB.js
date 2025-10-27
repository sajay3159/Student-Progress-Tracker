import firebaseConfig from "../firebaseConfig";

const DB_URL = firebaseConfig.databaseURL;

// ........Student Page.........
// Get all students
export const fetchStudents = async () => {
  const res = await fetch(`${DB_URL}/students.json`);
  if (!res.ok) throw new Error("Failed to fetch students");
  const data = await res.json();
  // Convert Firebase object to array
  return data
    ? Object.entries(data).map(([id, value]) => ({ id, ...value }))
    : [];
};

// Add new student
export const addStudent = async (student) => {
  const res = await fetch(`${DB_URL}/students.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student),
  });
  if (!res.ok) throw new Error("Failed to add student");
  return await res.json();
};

// Update an existing student
export const updateStudents = async (student) => {
  const { id, ...data } = student;
  const res = await fetch(`${DB_URL}/students/${id}.json`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update student");
  return { id, ...data };
};

// Delete student
export const deleteStudent = async (id) => {
  const res = await fetch(`${DB_URL}/students/${id}.json`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete student");
  return true;
};

// ......... Attendance Page..........

// Fetch all attendance records
export const fetchAttendanceRecords = async () => {
  const res = await fetch(`${DB_URL}/attendance.json`);
  if (!res.ok) throw new Error("Failed to fetch attendance records");
  const data = await res.json();
  return data || {};
};

// Save one student's attendance
export const saveStudentAttendance = async (studentId, studentData) => {
  const res = await fetch(`${DB_URL}/attendance/${studentId}.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(studentData),
  });
  if (!res.ok) throw new Error("Failed to save attendance");
  return await res.json();
};

//  Create an empty attendance record for new student
export const createAttendanceRecord = async (studentId, studentData) => {
  const response = await fetch(`${DB_URL}/attendance/${studentId}.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(studentData),
  });

  if (!response.ok) throw new Error("Failed to create attendance record");
  return await response.json();
};
