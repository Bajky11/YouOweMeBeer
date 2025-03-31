package com.friends.friends.Controller;


import com.friends.friends.Dto.TaskDTO;
import com.friends.friends.Dto.TaskSummaryResponse;
import com.friends.friends.Entity.Task;
import com.friends.friends.Enums.TaskStatus;
import com.friends.friends.Repository.TaskRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskRepository taskRepository;

    public TaskController(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    // "http://localhost:8080/timeIsMoney/api/tasks"
    // "http://localhost:8080/timeIsMoney/api/tasks?week=true"

    @GetMapping
    public ResponseEntity<List<Task>> getTasks(
            @RequestParam(required = false) Boolean week,
            @RequestParam(required = false) Boolean month,
            @RequestParam(required = false) Boolean year) {

        LocalDateTime fromDate = null;
        LocalDateTime now = LocalDateTime.now();

        if (Boolean.TRUE.equals(week)) {
            fromDate = now.minusWeeks(1);
        } else if (Boolean.TRUE.equals(month)) {
            fromDate = now.minusMonths(1);
        } else if (Boolean.TRUE.equals(year)) {
            fromDate = now.minusYears(1);
        }

        List<Task> tasks = (fromDate != null)
                ? taskRepository.findAllCreatedAfter(fromDate)
                : taskRepository.findAll();

        return ResponseEntity.ok(tasks);
    }

    // "http://localhost:8080/tasks/active"

    // ✅ Získání všech aktivních (běžících nebo pozastavených) úkolů
    @GetMapping("/active")
    public ResponseEntity<List<Task>> getActiveTasks() {
        List<Task> activeTasks = taskRepository.findAllActiveTasks(List.of(TaskStatus.RUNNING, TaskStatus.PAUSED));

        if (activeTasks.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(activeTasks);
    }


    /*
    {
  "name": "Dokončit projekt",
  "hourlyRate": 450,
  "tag": "work",
  "status": "RUNNING"
}
     */
    @PostMapping
    public ResponseEntity<Task> createTask(@Valid @RequestBody TaskDTO taskDTO) {
        Task task = new Task();
        task.setName(taskDTO.getName());
        task.setHourlyRate(taskDTO.getHourlyRate());
        task.setTag(taskDTO.getTag());
        task.setStatus(taskDTO.getStatus());
        task.setCreatedAt(LocalDateTime.now());
        task.setTotalTime(0L);
        task.setTotalTime(taskDTO.getTotalTime());

        BigDecimal earned = task.getHourlyRate()
                .multiply(BigDecimal.valueOf(taskDTO.getTotalTime()))
                .divide(BigDecimal.valueOf(3600), 2, RoundingMode.HALF_UP);

        task.setEarnings(earned);

        // Pokud je task hned "RUNNING", nastavíme startTime
        if (task.getStatus() == TaskStatus.RUNNING) {
            task.setStartTime(LocalDateTime.now());
        }

        Task savedTask = taskRepository.save(task);
        return ResponseEntity.ok(savedTask);
    }


    // "http://localhost:8080/tasks/3"

    // ✅ Odstranění úkolu podle ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        if (taskRepository.existsById(id)) {
            taskRepository.deleteById(id);
            return ResponseEntity.noContent().build(); // 204 No Content
        }
        return ResponseEntity.notFound().build(); // 404 Not Found
    }

    // http://localhost:8080/tasks/1/start

    // ✅ Spuštění úkolu
    @PostMapping("/{id}/start")
    public ResponseEntity<Task> startTask(@PathVariable Long id) {
        Optional<Task> optionalTask = taskRepository.findById(id);

        if (optionalTask.isPresent()) {
            Task task = optionalTask.get();

            if (task.getStatus() == TaskStatus.COMPLETED) {
                return ResponseEntity.badRequest().body(null); // Nelze spustit dokončený úkol
            }

            task.setStartTime(LocalDateTime.now());
            task.setStatus(TaskStatus.RUNNING);
            return ResponseEntity.ok(taskRepository.save(task));
        }

        return ResponseEntity.notFound().build();
    }

    // "http://localhost:8080/tasks/3/adjust-time?timeAdjustment=300"   +300
    // "http://localhost:8080/tasks/3/adjust-time?timeAdjustment=-120"  -120

    // ✅ Úprava totalTime a earnings pro konkrétní úkol
    @PatchMapping("/{id}/adjust-time")
    public ResponseEntity<Task> adjustTaskTime(@PathVariable Long id, @RequestParam Long timeAdjustment) {
        Optional<Task> optionalTask = taskRepository.findById(id);

        if (optionalTask.isPresent()) {
            Task task = optionalTask.get();

            // Úprava totalTime (přičítání nebo odčítání)
            long newTotalTime = task.getTotalTime() + timeAdjustment;
            task.setTotalTime(Math.max(newTotalTime, 0)); // Zabránění záporné hodnotě

            // Přepočet earnings na základě hodinové mzdy a nového času
            BigDecimal timeHours = BigDecimal.valueOf(timeAdjustment).divide(BigDecimal.valueOf(3600), 4, BigDecimal.ROUND_HALF_UP);
            BigDecimal earningsAdjustment = task.getHourlyRate().multiply(timeHours);
            task.setEarnings(task.getEarnings().add(earningsAdjustment));

            // Uložení změn do databáze
            Task updatedTask = taskRepository.save(task);

            return ResponseEntity.ok(updatedTask);
        }

        return ResponseEntity.notFound().build();
    }

    @PatchMapping("/{id}/set-time")
    public ResponseEntity<Task> setTaskTime(@PathVariable Long id, @RequestParam Long newTotalTime) {
        Optional<Task> optionalTask = taskRepository.findById(id);

        if (optionalTask.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Task task = optionalTask.get();

        // Zajištění nezáporné hodnoty
        long safeTotalTime = Math.max(newTotalTime, 0);
        task.setTotalTime(safeTotalTime);

        // Přepočet earnings
        BigDecimal timeHours = BigDecimal.valueOf(safeTotalTime)
                .divide(BigDecimal.valueOf(3600), 4, RoundingMode.HALF_UP);
        BigDecimal newEarnings = task.getHourlyRate().multiply(timeHours);
        task.setEarnings(newEarnings);

        // Uložení změn
        Task updatedTask = taskRepository.save(task);

        return ResponseEntity.ok(updatedTask);
    }


    // "http://localhost:8080/tasks/1/pause"

    // ✅ Pozastavení úkolu
    @PostMapping("/{id}/pause")
    public ResponseEntity<Task> pauseTask(@PathVariable Long id) {
        Optional<Task> optionalTask = taskRepository.findById(id);

        if (optionalTask.isPresent()) {
            Task task = optionalTask.get();

            if (task.getStatus() != TaskStatus.RUNNING || task.getStartTime() == null) {
                return ResponseEntity.badRequest().body(null); // Nelze pauzovat neaktivní úkol
            }

            long elapsedSeconds = Duration.between(task.getStartTime(), LocalDateTime.now()).getSeconds();
            task.setTotalTime(task.getTotalTime() + elapsedSeconds);

            BigDecimal earned = task.getHourlyRate().multiply(BigDecimal.valueOf(elapsedSeconds / 3600.0));
            task.setEarnings(task.getEarnings().add(earned));

            task.setStartTime(null);
            task.setStatus(TaskStatus.PAUSED);
            return ResponseEntity.ok(taskRepository.save(task));
        }

        return ResponseEntity.notFound().build();
    }

    // "http://localhost:8080/tasks/1/complete"

    // ✅ Dokončení úkolu
    @PostMapping("/{id}/complete")
    public ResponseEntity<Task> completeTask(@PathVariable Long id) {
        Optional<Task> optionalTask = taskRepository.findById(id);

        if (optionalTask.isPresent()) {
            Task task = optionalTask.get();

            if (task.getStatus() == TaskStatus.RUNNING) {
                long elapsedSeconds = Duration.between(task.getStartTime(), LocalDateTime.now()).getSeconds();
                task.setTotalTime(task.getTotalTime() + elapsedSeconds);

                BigDecimal earned = task.getHourlyRate().multiply(BigDecimal.valueOf(elapsedSeconds / 3600.0));
                task.setEarnings(task.getEarnings().add(earned));

                task.setStartTime(null);
            }

            task.setStatus(TaskStatus.COMPLETED);
            return ResponseEntity.ok(taskRepository.save(task));
        }

        return ResponseEntity.notFound().build();
    }

    // "http://localhost:8080/tasks/summary"
    // "http://localhost:8080/tasks/summary?week=true"

    // ✅ Součet `earnings` a `totalTime` za týden, měsíc nebo rok
    @GetMapping("/summary")
    public ResponseEntity<TaskSummaryResponse> getTaskSummary(
            @RequestParam(required = false) Boolean week,
            @RequestParam(required = false) Boolean month,
            @RequestParam(required = false) Boolean year) {

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime fromDate = null;

        if (Boolean.TRUE.equals(week)) {
            fromDate = now.minusWeeks(1);
        } else if (Boolean.TRUE.equals(month)) {
            fromDate = now.minusMonths(1);
        } else if (Boolean.TRUE.equals(year)) {
            fromDate = now.minusYears(1);
        }

        List<Task> tasks = (fromDate != null)
                ? taskRepository.findAllCreatedAfter(fromDate)
                : taskRepository.findAll();

        BigDecimal totalEarnings = tasks.stream()
                .map(Task::getEarnings)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long totalTime = tasks.stream()
                .mapToLong(Task::getTotalTime)
                .sum();

        Integer totalTasks = tasks.size();

        return ResponseEntity.ok(new TaskSummaryResponse(totalEarnings, totalTime, totalTasks));
    }
}
