package com.niit.KanbanBoardService.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.CONFLICT,reason = "board already exists in userDB")
public class BoardAlreadyExistsException extends Exception{
}
