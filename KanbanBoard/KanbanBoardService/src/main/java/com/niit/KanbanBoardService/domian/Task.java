package com.niit.KanbanBoardService.domian;


import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;


@Document
public class Task {

    @Transient
    public static final String SEQUENCE_NAME = "tasks_sequence";
    @Id
    private String taskId;
    private String taskName;
    private String taskDescription;
    private String taskImageAdd;
    private String priority;
    private boolean assigned;
    private Date creationDateTime;


    public Task() {
        this.creationDateTime = new Date(); // Initialize creationDateTime with current date and time
    }


    public Task(String taskId, String taskName, String taskDescription, String taskImageAdd, String priority, boolean assigned, Date creationDateTime) {
        this.taskId = taskId;
        this.taskName = taskName;
        this.taskDescription = taskDescription;
        this.taskImageAdd = taskImageAdd;
        this.priority = priority;
        this.assigned = assigned;
        this.creationDateTime = creationDateTime;
    }

    @Override
    public String toString() {
        return "Task{" +
                "taskId='" + taskId + '\'' +
                ", taskName='" + taskName + '\'' +
                ", taskDescription='" + taskDescription + '\'' +
                ", taskImageAdd='" + taskImageAdd + '\'' +
                ", priority='" + priority + '\'' +
                ", assigned=" + assigned +
                ", creationDateTime=" + creationDateTime +
                '}';
    }

    public String getTaskId() {
        return taskId;
    }

    public void setTaskId(String taskId) {
        this.taskId = taskId;
    }

    public String getTaskName() {
        return taskName;
    }

    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }

    public String getTaskImageAdd() {
        return taskImageAdd;
    }

    public void setTaskImageAdd(String taskImageAdd) {
        this.taskImageAdd = taskImageAdd;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public boolean getAssigned() {
        return assigned;
    }

    public void setAssigned(boolean assigned) {
        this.assigned = assigned;
    }

    public Date getCreationDateTime() {
        return creationDateTime;
    }

    public void setCreationDateTime(Date creationDateTime) {
        this.creationDateTime = creationDateTime;
    }

    public String getTaskDescription() {
        return taskDescription;
    }

    public void setTaskDescription(String taskDescription) {
        this.taskDescription = taskDescription;
    }
}
