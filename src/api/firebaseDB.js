import firebaseConfig from "../firebaseConfig";

const DB_URL = firebaseConfig.databaseURL;

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

// Delete student
export const deleteStudent = async (id) => {
  const res = await fetch(`${DB_URL}/students/${id}.json`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete student");
  return true;
};
