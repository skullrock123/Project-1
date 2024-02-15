package com.bej.authentication.domain;

import javax.persistence.Entity;
import javax.persistence.Id;


@Entity
public class User {
    @Id
    private String emailId;
    private String password;
    private String username;

    public User() {
    }

    public User(String emailId, String password, String username) {
        this.emailId = emailId;
        this.password = password;
        this.username = username;
    }

    @Override
    public String toString() {
        return "User{" +
                "emailId='" + emailId + '\'' +
                ", password='" + password + '\'' +
                ", username='" + username + '\'' +
                '}';
    }

    public String getEmailId() {
        return emailId;
    }

    public void setEmailId(String emailId) {
        this.emailId = emailId;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @Override
    public boolean equals(Object obj) {
        User user = (User) obj;
        return (this.emailId.equals(user.getEmailId()) && this.password.equals(user.getPassword()) && this.username.equals(user.getUsername()))?true:false;
    }
}
