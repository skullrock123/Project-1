package com.niit.KanbanBoardService.proxy;

import com.niit.KanbanBoardService.domian.EmailData;
import com.niit.KanbanBoardService.domian.EmailDataWithoutAttachment;
import com.niit.KanbanBoardService.domian.User;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "notification-service",url = "localhost:7777")
public interface UserMailProxy {

    @PostMapping("/api/v3/sendMail")
    public String sendMail(@RequestBody EmailDataWithoutAttachment details);
    @PostMapping("/api/v3/sendMailWithAttachment")
    public String sendUserDataToMailWithAttachment(@RequestBody EmailData details);
}
