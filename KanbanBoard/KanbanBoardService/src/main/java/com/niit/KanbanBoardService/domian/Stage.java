package com.niit.KanbanBoardService.domian;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;


@Document
public class Stage {
    @Id
    //private String stageId;
    private String stageName;
    private List<Task> myTasks;

    public Stage() {
    }

    public Stage(String stageName, List<Task> myTasks) {
        this.stageName = stageName;
        this.myTasks = myTasks;
    }

    @Override
    public String toString() {
        return "Stage{" +
                "stageName='" + stageName + '\'' +
                ", myTasks=" + myTasks +
                '}';
    }

    @Override
    public boolean equals(Object obj) {
        Stage s =(Stage) obj;
        return (this.stageName.equals(s.getStageName()) && this.myTasks.equals(s.getMyTasks()))? true:false;
    }

    public String getStageName() {
        return stageName;
    }

    public void setStageName(String stageName) {
        this.stageName = stageName;
    }

    public List<Task> getMyTasks() {
        return myTasks;
    }

    public void setMyTasks(List<Task> myTasks) {
        this.myTasks = myTasks;
    }
}
