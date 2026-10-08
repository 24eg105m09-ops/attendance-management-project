import { useEffect, useState } from "react";
import "./App.css";
import Login from "./Login";
import Students from "./Students";
import Attendance from "./Attendance";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [totalStudents, setTotalStudents] = useState(0);
const [presentToday, setPresentToday] = useState(0);
const [absentToday, setAbsentToday] = useState(0);
const [attendanceRecords, setAttendanceRecords] = useState([]);
useEffect(() =>
   {

  // Get total students
  fetch("http://localhost:8080/students")
    .then(response => response.json())
    .then(data => {
      setTotalStudents(data.length);
    })
    .catch(error => console.error("Student error:", error));

  // Get attendance records
  fetch("http://localhost:8080/attendance")
    .then(response => response.json())
    .then(data => {

      const today = new Date().toISOString().split("T")[0];

      const todayAttendance = data.filter(
        record => record.date === today
      );

      const present = todayAttendance.filter(
        record => record.status === "Present"
      ).length;

      const absent = todayAttendance.filter(
        record => record.status === "Absent"
      ).length;

      setPresentToday(present);
      setAbsentToday(absent);

    })
    .catch(error => console.error("Attendance error:", error));

   
        // Get attendance records
    fetch("http://localhost:8080/attendance")
      .then(response => response.json())
      .then(data => {

        const today = new Date().toISOString().split("T")[0];

        const todayRecords = data.filter(
          record => record.date === today
        );

        setAttendanceRecords(todayRecords);

      })
      .catch(error => console.error("Attendance records error:", error));
}, []);
  


  // Show Login page if user is not logged in
  if (!isLoggedIn) {
    return (
      <Login onLogin={() => setIsLoggedIn(true)} />
    );
  }

  // Logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setPage("dashboard");
  };

  return (
    <div className="app">

      {/* Navigation Bar */}
      <nav className="navbar">

        <h2>Attendance Management System</h2>

        <div className="nav-links">

          <span onClick={() => setPage("dashboard")}>
            Dashboard
          </span>

          <span onClick={() => setPage("students")}>
            Students
          </span>

          <span onClick={() => setPage("attendance")}>
            Attendance
          </span>

          <button onClick={handleLogout}>
            Logout
          </button>

        </div>

      </nav>

      {/* Dashboard */}
      {page === "dashboard" && (
        <main className="container">

          <h1>Dashboard</h1>

          <p className="welcome">
            Welcome to Attendance Management System
          </p>

          <div className="card">
  <h3>Total Students</h3>
  <p>{totalStudents}</p>
</div>

<div className="card">
  <h3>Present Today</h3>
  <p>{presentToday}</p>
</div>

<div className="card">
  <h3>Absent Today</h3>
  <p>{absentToday}</p>
</div>

<div className="card">
  <h3>Attendance Percentage</h3>
  <p>
    {totalStudents > 0
      ? Math.round((presentToday / totalStudents) * 100)
      : 0}%
  </p>
</div>
  

          <section className="attendance-section">

            <h2>Today's Attendance</h2>

            <table>

              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Course</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

  {attendanceRecords.map(record => (
    <tr key={record.id}>

      <td>{record.studentId}</td>

      <td>{record.studentName}</td>

      <td>{record.course}</td>

      <td className={
        record.status === "Present"
          ? "present"
          : "absent"
      }>
        {record.status}
      </td>

    </tr>
  ))}

</tbody>

            </table>

          </section>

        </main>
      )}

      {/* Students Page */}
      {page === "students" && (
        <Students />
      )}

      {/* Attendance Page */}
      {page === "attendance" && (
        <Attendance />
      )}

    </div>
  );
}

export default App;