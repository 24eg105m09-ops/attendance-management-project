
package com.example.attendance_management;

import java.time.LocalDate;
import java.util.List;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/attendance")
@CrossOrigin(origins ="*")
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

        if (attendance.getDate() == null ||
            attendance.getDate().isEmpty()) {
            attendance.setDate(LocalDate.now().toString());
        }

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

        return attendanceRepository.save(attendance);
    }

    // Delete attendance by ID
    @DeleteMapping("/{id}")
    public void deleteAttendance(@PathVariable Long id) {
        attendanceRepository.deleteById(id);
    }
}