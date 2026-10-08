package com.example.attendance_management;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/attendance")
@CrossOrigin(origins = "http://localhost:5173")
public class AttendanceController {

    private final AttendanceRepository attendanceRepository;

    public AttendanceController(AttendanceRepository attendanceRepository) {
        this.attendanceRepository = attendanceRepository;
    }

    // Get all attendance records
    @GetMapping
    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }

    // Save or update attendance
    @PostMapping
    public Attendance addAttendance(@RequestBody Attendance attendance) {

        // If date is empty, use today's date
        if (attendance.getDate() == null || attendance.getDate().isEmpty()) {
            attendance.setDate(LocalDate.now().toString());
        }

        // Check if attendance already exists for this student and date
        var existingAttendance =
                attendanceRepository.findByStudentIdAndDate(
                        attendance.getStudentId(),
                        attendance.getDate()
                );

        if (existingAttendance.isPresent()) {

            Attendance record = existingAttendance.get();

            record.setStudentName(attendance.getStudentName());
            record.setCourse(attendance.getCourse());
            record.setStatus(attendance.getStatus());

            return attendanceRepository.save(record);
        }

        // Create a new attendance record
        return attendanceRepository.save(attendance);
    }
    @DeleteMapping("/{id}")
public void deleteAttendance(@PathVariable Long id) {
    attendanceRepository.deleteById(id);
}
}