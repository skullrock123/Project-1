package com.niit.KanbanBoardService.proxy;

import com.niit.KanbanBoardService.domian.User;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "user-authentication-service", url = "localhost:8083")
public interface UserAuthProxy {
    @PostMapping("/api/v2/save")
    public ResponseEntity<?> saveUser(@RequestBody User user);
}
