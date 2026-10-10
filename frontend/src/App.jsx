
import { useEffect, useState } from "react";
import Login from "./Login";
import Students from "./Students";
import Attendance from "./Attendance";

const API_URL = "https://attendance-management-project-v5fk.onrender.com";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    if (!isLoggedIn) return;

    fetch(`${API_URL}/students`)
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load students");
        return response.json();
      })
      .then((data) => setStudents(data))
      .catch((error) => console.error("Students error:", error));

    fetch(`${API_URL}/attendance`)
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load attendance");
        return response.json();
      })
      .then((data) => setAttendance(data))
      .catch((error) => console.error("Attendance error:", error));
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  const today = new Date().toISOString().split("T")[0];

  const todayAttendance = attendance.filter(
    (record) => record.date === today
  );

  const presentCount = todayAttendance.filter(
    (record) => record.status?.toLowerCase() === "present"
  ).length;

  const absentCount = todayAttendance.filter(
    (record) => record.status?.toLowerCase() === "absent"
  ).length;

  return (
    <div className="app">
      <nav className="navbar">
        <h2>Attendance Management System</h2>

        <div className="nav-links">
          <span onClick={() => setPage("dashboard")}>Dashboard</span>
          <span onClick={() => setPage("students")}>Students</span>
          <span onClick={() => setPage("attendance")}>Attendance</span>

          <button
            onClick={() => {
              setIsLoggedIn(false);
              setPage("dashboard");
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      {page === "dashboard" && (
        <main className="container">
          <h1>Dashboard</h1>
          <p className="welcome">
            Welcome to Attendance Management System
          </p>

          <div className="cards">
            <div className="card">
              <h3>Total Students</h3>
              <p>{students.length}</p>
            </div>

            <div className="card">
              <h3>Present Today</h3>
              <p>{presentCount}</p>
            </div>

            <div className="card">
              <h3>Absent Today</h3>
              <p>{absentCount}</p>
            </div>

            <div className="card">
              <h3>Total Attendance Records</h3>
              <p>{attendance.length}</p>
            </div>
          </div>

          <section className="attendance-section">
            <h2>Recent Attendance</h2>

            {todayAttendance.length === 0 ? (
              <p>No attendance records found for today.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Course</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {todayAttendance.map((record) => (
                    <tr key={record.id}>
                      <td>{record.studentName}</td>
                      <td>{record.course}</td>
                      <td>{record.date}</td>
                      <td
                        className={
                          record.status?.toLowerCase() === "present"
                            ? "present"
                            : "absent"
                        }
                      >
                        {record.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </main>
      )}

      {page === "students" && <Students />}

      {page === "attendance" && <Attendance />}
    </div>
  );
}

export default App;
