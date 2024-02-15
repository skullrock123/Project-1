package com.niit.KanbanBoardService.domian;


import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;


@Document
public class User {
    @Id
    private String emailId;
    private String username;
    @Transient
    private String password;
    private String profession;
    private ImageModel userImage;
    private List<Board> myBoards;

    public User() {
    }

    public User(String emailId, String username, String password, String profession, ImageModel userImage, List<Board> myBoards) {
        this.emailId = emailId;
        this.username = username;
        this.password = password;
        this.profession = profession;
        this.userImage = userImage;
        this.myBoards = myBoards;
    }

    @Override
    public String toString() {
        return "User{" +
                "emailId='" + emailId + '\'' +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", profession='" + profession + '\'' +
                ", userImage=" + userImage +
                ", myBoards=" + myBoards +
                '}';
    }



    public String getEmailId() {
        return emailId;
    }

    public void setEmailId(String emailId) {
        this.emailId = emailId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getProfession() {
        return profession;
    }

    public void setProfession(String profession) {
        this.profession = profession;
    }

    public List<Board> getMyBoards() {
        return myBoards;
    }

    public void setMyBoards(List<Board> myBoards) {
        this.myBoards = myBoards;
    }

    public ImageModel getUserImage() {
        return userImage;
    }

    public void setUserImage(ImageModel userImage) {
        this.userImage = userImage;
    }
}
