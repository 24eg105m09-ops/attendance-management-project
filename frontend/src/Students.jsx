
import { useEffect, useState } from "react";

const API_URL =
  "https://attendance-management-project-v5fk.onrender.com";

function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    course: "",
    email: "",
  });

  // Get students from backend
  const loadStudents = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/students`);

      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }

      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Error loading students:", error);
      setMessage("Unable to load students. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // Handle input changes
  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  // Add student
  const addStudent = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Failed to add student");
      }

      setForm({
        name: "",
        course: "",
        email: "",
      });

      setMessage("Student added successfully!");
      await loadStudents();
    } catch (error) {
      console.error("Error adding student:", error);
      setMessage("Unable to add student. Please check the details.");
    }
  };

  // Delete student
  const deleteStudent = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmed) return;

    setMessage("");

    try {
      const response = await fetch(`${API_URL}/students/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete student");
      }

      setStudents((currentStudents) =>
        currentStudents.filter(
          (student) => String(student.id) !== String(id)
        )
      );

      setMessage("Student deleted successfully!");
    } catch (error) {
      console.error("Error deleting student:", error);
      setMessage("Unable to delete student.");
    }
  };

  return (
    <div className="container">
      <h1>Student Management</h1>

      {message && <p>{message}</p>}

      <form onSubmit={addStudent}>
        <input
          type="text"
          name="name"
          placeholder="Student Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="course"
          placeholder="Course"
          value={form.course}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <button type="submit">Add Student</button>
      </form>

      <h2>Students List</h2>

      {loading ? (
        <p>Loading students...</p>
      ) : students.length === 0 ? (
        <p>No students found. Add your first student above.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Course</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.course}</td>
                <td>{student.email}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => deleteStudent(student.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Students;
