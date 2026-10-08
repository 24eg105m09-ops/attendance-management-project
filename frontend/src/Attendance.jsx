import { useEffect, useState } from "react";

function Attendance() {

  const [students, setStudents] = useState([]);

  // Get students from backend
 useEffect(() => {

  fetch("http://localhost:8080/students")
    .then(response => response.json())
    .then(studentData => {

      fetch("http://localhost:8080/attendance")
        .then(response => response.json())
        .then(attendanceData => {

          const today = new Date().toISOString().split("T")[0];

          const updatedStudents = studentData.map(student => {

            const record = attendanceData.find(
              attendance =>
                Number(attendance.studentId) === Number(student.id) &&
                attendance.date === today
            );

            return {
              ...student,
              status: record ? record.status : "Not Marked"
            };

          });

          setStudents(updatedStudents);

        });

    })
    .catch(error => console.error("Error:", error));

}, []);

  // Mark Present
  const markPresent = (id) => {

    const student = students.find(s => s.id === id);

    const attendance = {
      studentId: student.id,
      studentName: student.name,
      course: student.course,
      date: new Date().toISOString().split("T")[0],
      status: "Present"
    };

    fetch("http://localhost:8080/attendance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(attendance)
    })
      .then(response => response.json())
      .then(() => {

        setStudents(
          students.map(student =>
            student.id === id
              ? { ...student, status: "Present" }
              : student
          )
        );

      })
      .catch(error => console.error("Error:", error));
  };

  // Mark Absent
  const markAbsent = (id) => {

    const student = students.find(s => s.id === id);

    const attendance = {
      studentId: student.id,
      studentName: student.name,
      course: student.course,
      date: new Date().toISOString().split("T")[0],
      status: "Absent"
    };

    fetch("http://localhost:8080/attendance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(attendance)
    })
      .then(response => response.json())
      .then(() => {

        setStudents(
          students.map(student =>
            student.id === id
              ? { ...student, status: "Absent" }
              : student
          )
        );

      })
      .catch(error => console.error("Error:", error));
  };

  return (
    <div className="container">

      <h1>Attendance</h1>

      <table>

        <thead>
          <tr>
            <th>Student ID</th>
            <th>Name</th>
            <th>Course</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {students.map(student => (

            <tr key={student.id}>

              <td>{student.id}</td>

              <td>{student.name}</td>

              <td>{student.course}</td>

              <td>{student.status}</td>

              <td>

                <button
                  onClick={() => markPresent(student.id)}
                >
                  Present
                </button>

                <button
                  onClick={() => markAbsent(student.id)}
                >
                  Absent
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default Attendance;