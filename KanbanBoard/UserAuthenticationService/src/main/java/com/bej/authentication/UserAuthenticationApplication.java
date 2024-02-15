package com.bej.authentication;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;


@SpringBootApplication
@EnableEurekaClient
public class UserAuthenticationApplication {
    public static void main(String[] args) {
        SpringApplication.run(UserAuthenticationApplication.class, args);
        System.out.println("User auth is running....");
    }

}
