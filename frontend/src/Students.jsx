import { useEffect, useState } from "react";

function Students() {

  const [students, setStudents] = useState([]);

  const [form, setForm] = useState({
    name: "",
    course: "",
    email: ""
  });

  // Get students from backend
  useEffect(() => {
    fetch("https://attendance-management-project-v5fk.onrender.com/students")
      .then(response => response.json())
      .then(data => setStudents(data))
      .catch(error => console.error("Error:", error));
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Add student
  const addStudent = (e) => {

    e.preventDefault();

    fetch("https://attendance-management-project-v5fk.onrender.com/students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    })
      .then(response => response.json())
      .then(newStudent => {

        setStudents([...students, newStudent]);

        setForm({
          name: "",
          course: "",
          email: ""
        });

      })
      .catch(error => console.error("Error:", error));
  };

  // Delete student
  const deleteStudent = (id) => {

    fetch(`https://attendance-management-project-v5fk.onrender.com/students/${id}`, {
      method: "DELETE"
    })
      .then(() => {

        setStudents(
          students.filter(student => student.id !== id)
        );

      })
      .catch(error => console.error("Error:", error));
  };

  return (
    <div>

      <h2>Student Management</h2>

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

        <button type="submit">
          Add Student
        </button>

      </form>

      <h3>Students List</h3>

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

          {students.map(student => (

            <tr key={student.id}>

              <td>{student.id}</td>
              <td>{student.name}</td>
              <td>{student.course}</td>
              <td>{student.email}</td>

              <td>
                <button
                  onClick={() => deleteStudent(student.id)}
                >
                  Delete
                </button>
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default Students;