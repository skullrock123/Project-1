package com.niit.NotificationService.service;

import com.niit.NotificationService.domain.EmailData;
import com.niit.NotificationService.domain.EmailDataWithoutAttachment;

public interface EmailService {
    // Method
    // To send a simple email
    String sendSimpleMail(EmailDataWithoutAttachment details);

    // Method
    // To send an email with attachment
    String sendMailWithAttachment(EmailData details);
}
