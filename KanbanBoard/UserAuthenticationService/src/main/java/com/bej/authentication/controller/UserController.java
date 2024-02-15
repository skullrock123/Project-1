package com.bej.authentication.controller;

import com.bej.authentication.exception.InvalidCredentialsException;
import com.bej.authentication.exception.UserAlreadyExistsException;
import com.bej.authentication.security.JWTSecurityTokenGeneratorImpl;
import com.bej.authentication.service.UserService;
import com.bej.authentication.domain.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v2")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private JWTSecurityTokenGeneratorImpl securityTokenGenerator;

    private ResponseEntity responseEntity;


    @PostMapping("/save")
    public ResponseEntity<?> saveUser(@RequestBody User user) {
        // Write the logic to save a user,
        // return 201 status if user is saved else 500 status
        try {
            User userData = userService.saveUser(user);
            responseEntity = new ResponseEntity<>(userData, HttpStatus.CREATED);
        }catch (UserAlreadyExistsException e) {
            responseEntity = new ResponseEntity<>(e.getMessage(),HttpStatus.CONFLICT);
        }
        catch (Exception e) {
            responseEntity = new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return responseEntity;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user)  {
        // Generate the token on login,
        // return 200 status if user is saved else 500 status
        String token = "";
        try {
            User userData = userService.loginUser(user.getEmailId(), user.getPassword());
            if (userData.getEmailId().equals(user.getEmailId())) {
                token = securityTokenGenerator.createToken(user);
            }
            responseEntity = new ResponseEntity<>(token, HttpStatus.OK);
        }catch (InvalidCredentialsException e){
            responseEntity = new ResponseEntity<>(e.getMessage(),HttpStatus.UNAUTHORIZED);
        }catch (Exception e){
            responseEntity = new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return responseEntity;
    }

}
