package com.niit.KanbanBoardService.domian;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;


@Document
public class Board {
    @Id
    private String boardName;
    //private String boardId;
    private List<Stage> myStages;
    private List<Member> boardMembers;

    public Board() {
    }

    public Board(String boardName, List<Stage> myStages, List<Member> boardMembers) {
        this.boardName = boardName;
        this.myStages = myStages;
        this.boardMembers = boardMembers;
    }

    @Override
    public String toString() {
        return "Board{" +
                "boardName='" + boardName + '\'' +
                ", myStages=" + myStages +
                ", boardMembers=" + boardMembers +
                '}';
    }

    @Override
    public boolean equals(Object obj) {
        Board b = (Board) obj;
        return (this.boardName.equals(b.getBoardName()) && this.myStages.equals(b.getMyStages()) && this.boardMembers.equals(b.getBoardMembers()))?true:false;
    }

    public String getBoardName() {
        return boardName;
    }

    public void setBoardName(String boardName) {
        this.boardName = boardName;
    }

    public List<Stage> getMyStages() {
        return myStages;
    }

    public void setMyStages(List<Stage> myStages) {
        this.myStages = myStages;
    }

    public List<Member> getBoardMembers() {
        return boardMembers;
    }

    public void setBoardMembers(List<Member> boardMembers) {
        this.boardMembers = boardMembers;
    }
}
