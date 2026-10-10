
import { useEffect, useState } from "react";

const API_URL = "https://attendance-management-project-v5fk.onrender.com";

function Attendance() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const loadData = async () => {
    try {
      setLoading(true);

      const [studentsResponse, attendanceResponse] = await Promise.all([
        fetch(`${API_URL}/students`),
        fetch(`${API_URL}/attendance`),
      ]);

      if (!studentsResponse.ok || !attendanceResponse.ok) {
        throw new Error("Unable to load data");
      }

      const studentsData = await studentsResponse.json();
      const attendanceData = await attendanceResponse.json();

      setStudents(studentsData);
      setAttendance(attendanceData);
    } catch (error) {
      console.error("Attendance loading error:", error);
      setMessage("Unable to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const markAttendance = async (student, status) => {
    setMessage("");

    const alreadyMarked = attendance.some(
      (record) =>
        String(record.studentId) === String(student.id) &&
        String(record.date).slice(0, 10) === today
    );

    if (alreadyMarked) {
      setMessage("Attendance has already been marked for this student today.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/attendance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: student.id,
          studentName: student.name,
          course: student.course,
          date: today,
          status: status,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save attendance");
      }

      setMessage(`${student.name}: marked ${status.toLowerCase()} successfully.`);
      await loadData();
    } catch (error) {
      console.error("Mark attendance error:", error);
      setMessage(
        "Could not save attendance. Please check the backend and try again."
      );
    }
  };

  if (loading) {
    return <div className="container"><h2>Loading attendance...</h2></div>;
  }

  return (
    <div className="container">
      <h1>Attendance Management</h1>
      <p className="welcome">Mark student attendance for {today}</p>

      {message && (
        <p role="status" style={{ margin: "15px 0", color: "#1e3a8a" }}>
          {message}
        </p>
      )}

      <section className="attendance-section">
        <h2>Student Attendance</h2>

        {students.length === 0 ? (
          <p>No students found. Please add students first.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Student Name</th>
                <th>Course</th>
                <th>Today's Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {students.map((student) => {
                const record = attendance.find(
                  (item) =>
                    String(item.studentId) === String(student.id) &&
                    String(item.date).slice(0, 10) === today
                );

                return (
                  <tr key={student.id}>
                    <td>{student.id}</td>
                    <td>{student.name}</td>
                    <td>{student.course}</td>
                    <td
                      className={
                        record?.status?.toLowerCase() === "present"
                          ? "present"
                          : record?.status?.toLowerCase() === "absent"
                          ? "absent"
                          : ""
                      }
                    >
                      {record?.status || "Not Marked"}
                    </td>
                    <td>
                      <button
                        type="button"
                        disabled={Boolean(record)}
                        onClick={() => markAttendance(student, "Present")}
                      >
                        Present
                      </button>

                      <button
                        type="button"
                        disabled={Boolean(record)}
                        onClick={() => markAttendance(student, "Absent")}
                      >
                        Absent
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default Attendance;