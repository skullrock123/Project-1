package com.niit.KanbanBoardService.domian;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class TaskSequence {
    @Id
    private String id;
    private int seq;

    public TaskSequence(String id, int seq) {
        this.id = id;
        this.seq = seq;
    }

    public TaskSequence() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public int getSeq() {
        return seq;
    }

    public void setSeq(int seq) {
        this.seq = seq;
    }

    @Override
    public String toString() {
        return "TaskSequence{" +
                "id='" + id + '\'' +
                ", seq=" + seq +
                '}';
    }
}
