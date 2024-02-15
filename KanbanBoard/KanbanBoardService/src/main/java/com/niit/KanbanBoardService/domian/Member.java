package com.niit.KanbanBoardService.domian;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;


@Document
public class Member {
    @Id
    private String memberEmailId;
    private String memberName;
    private List<Task> myTask;

    public Member() {
    }

    public Member(String memberEmailId, String memberName, List<Task> myTask) {
        this.memberEmailId = memberEmailId;
        this.memberName = memberName;
        this.myTask = myTask;
    }


    @Override
    public String toString() {
        return "Member{" +
                "memberEmailId='" + memberEmailId + '\'' +
                ", memberName='" + memberName + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object obj) {
        Member m = (Member) obj;
        return (this.memberEmailId.equals(m.getMemberEmailId()) && this.memberName.equals(m.getMemberName()))?true:false;
    }

    public String getMemberEmailId() {
        return memberEmailId;
    }

    public void setMemberEmailId(String memberEmailId) {
        this.memberEmailId = memberEmailId;
    }

    public String getMemberName() {
        return memberName;
    }

    public void setMemberName(String memberName) {
        this.memberName = memberName;
    }

    public List<Task> getMyTask() {
        return myTask;
    }

    public void setMyTask(List<Task> myTask) {
        this.myTask = myTask;
    }
}
