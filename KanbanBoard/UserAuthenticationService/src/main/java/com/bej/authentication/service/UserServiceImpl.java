package com.bej.authentication.service;

import com.bej.authentication.domain.User;
import com.bej.authentication.exception.InvalidCredentialsException;
import com.bej.authentication.exception.UserAlreadyExistsException;
import com.bej.authentication.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;


    @Override
    public User saveUser(User user) throws UserAlreadyExistsException {
        //save the user in the db
        if (userRepository.findById(user.getEmailId()).isPresent()) {
            throw new UserAlreadyExistsException();
        }
        return userRepository.save(user);

    }

    @Override
    public User loginUser(String emailId, String password) throws InvalidCredentialsException {
        User loggedInUser = userRepository.findByEmailIdAndPassword(emailId, password);
        System.out.println(loggedInUser);
        if (loggedInUser.getEmailId() == null) {
            throw new InvalidCredentialsException();
        }
        return loggedInUser;
    }



}
