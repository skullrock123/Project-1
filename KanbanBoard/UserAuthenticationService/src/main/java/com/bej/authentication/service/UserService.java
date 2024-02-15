package com.bej.authentication.service;

import com.bej.authentication.domain.User;
import com.bej.authentication.exception.InvalidCredentialsException;
import com.bej.authentication.exception.UserAlreadyExistsException;

public interface UserService {
    User saveUser(User user) throws UserAlreadyExistsException;
    User loginUser(String emailId, String password) throws InvalidCredentialsException;


}
