package com.niit.KanbanBoardService.controller;

import com.niit.KanbanBoardService.domian.*;
import com.niit.KanbanBoardService.exception.*;
import com.niit.KanbanBoardService.service.UserService;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class KanBanController {
    private UserService userService;
    private ResponseEntity responseEntity;
    @Autowired
    public KanBanController(UserService userService) {
        this.userService = userService;
    }

    private  Long imageId = 1L;
    @PostMapping(value = {"/save"}, consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<?> save(@RequestPart("user") User user, @RequestPart("imageFile") MultipartFile file){
        try {
            ImageModel image =  uploadImage(file);
            image.setId(imageId);
            imageId ++;
            user.setUserImage(image);
            responseEntity = new ResponseEntity<>(userService.saveUser(user), HttpStatus.OK);
        }catch (UserAlreadyExistsException e){
            responseEntity = new ResponseEntity<>(e.getMessage(),HttpStatus.CONFLICT);
        }catch (Exception e){
            responseEntity = new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return responseEntity;
    }

    public ImageModel uploadImage(MultipartFile file) throws IOException {
        ImageModel imageModel = new ImageModel(
                file.getOriginalFilename(),
                file.getContentType(),
                file.getBytes()
        );
        return imageModel;
    }



    @PostMapping("/user/saveBoard")
    public ResponseEntity<?> saveNewBoard(@RequestBody Board board , HttpServletRequest request)  {
        String emailId = getUserIdFromClaims(request);
        System.out.println("emailId :: "+emailId);

        try {
            responseEntity = new ResponseEntity<>(userService.createNewBoard(board,emailId), HttpStatus.OK);
        }catch (InvalidCredentialsException e){
            responseEntity = new ResponseEntity<>(e.getMessage(),HttpStatus.UNAUTHORIZED);
        }catch (BoardAlreadyExistsException e){
            responseEntity = new ResponseEntity<>(e.getMessage(),HttpStatus.CONFLICT);
        }catch (Exception e){
            responseEntity = new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return responseEntity;
    }

    @PostMapping("/user/saveStages/{boardName}")
    public ResponseEntity<?> saveNewStages(@PathVariable String boardName, @RequestBody List<Stage> myStages , HttpServletRequest request)  {
        String emailId = getUserIdFromClaims(request);
        System.out.println("emailId :: "+emailId);
        try {
            responseEntity = new ResponseEntity<>(userService.addStagesIntoBoard(boardName,myStages,emailId), HttpStatus.OK);
        }catch (InvalidCredentialsException e){
            responseEntity = new ResponseEntity<>(e.getMessage(),HttpStatus.UNAUTHORIZED);
        }catch (BoardNotFoundException e){
            responseEntity = new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_FOUND);
        }catch (StageAlreadyExistException e){
            responseEntity = new ResponseEntity<>(e.getMessage(),HttpStatus.CONFLICT);
        }catch (Exception e){
            responseEntity = new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return responseEntity;
    }




    @PostMapping("/user/saveMembers/{boardName}")
    public ResponseEntity<?> saveMembers(@PathVariable String boardName, @RequestBody List<Member> boardMembers, HttpServletRequest request)  {
        String emailId = getUserIdFromClaims(request);
        System.out.println("emailId :: "+emailId);
        try {
            responseEntity = new ResponseEntity<>(userService.addMembersInBoard(boardName,boardMembers,emailId), HttpStatus.OK);
        }catch (InvalidCredentialsException e){
            responseEntity = new ResponseEntity<>(e.getMessage(),HttpStatus.UNAUTHORIZED);
        }catch (BoardNotFoundException e){
            responseEntity = new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_FOUND);
        }catch (MemberAlreadyExistException e){
            responseEntity = new ResponseEntity<>(e.getMessage(),HttpStatus.CONFLICT);
        }catch (Exception e){
            responseEntity = new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return responseEntity;
    }
    @PostMapping("/user/saveTask/{boardName}/{stageName}")
    public ResponseEntity<?> saveTaskToStage(@PathVariable String boardName, @PathVariable String stageName, @RequestBody Task task, HttpServletRequest request)  {
        String emailId = getUserIdFromClaims(request);
        System.out.println("emailId :: "+emailId);
        try {
            task.setTaskId(userService.generateSequence(Task.SEQUENCE_NAME));
            responseEntity = new ResponseEntity<>(userService.createNewTask(boardName,stageName,task,emailId), HttpStatus.OK);
        }catch (InvalidCredentialsException e){
            responseEntity = new ResponseEntity<>(e.getMessage(),HttpStatus.UNAUTHORIZED);
        }catch (BoardNotFoundException e){
            responseEntity = new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_FOUND);
        }catch (StageNotFoundException e){
            responseEntity = new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_FOUND);
        }catch (TaskAlreadyExistException e){
            responseEntity = new ResponseEntity<>(e.getMessage(),HttpStatus.CONFLICT);
        }catch (Exception e){
            responseEntity = new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return responseEntity;
    }

    @PostMapping("/user/transferTask/{boardName}/{fromStage}/{toStage}")
    public ResponseEntity<?> transferTaskFromOneToAnother(@PathVariable String boardName, @PathVariable String fromStage, @PathVariable String toStage , @RequestBody Task task, HttpServletRequest request)  {
        String emailId = getUserIdFromClaims(request);
        System.out.println("emailId :: "+emailId);
        try {
            responseEntity = new ResponseEntity<>(userService.moveTaskToAnotherStage(emailId,boardName,fromStage,toStage,task), HttpStatus.OK);
        }catch (InvalidCredentialsException e){
            responseEntity = new ResponseEntity<>(e.getMessage(),HttpStatus.UNAUTHORIZED);
        }catch (BoardNotFoundException e){
            responseEntity = new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_FOUND);
        }catch (StageNotFoundException e){
            responseEntity = new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_FOUND);
        }catch (TaskNotFoundException e){
            responseEntity = new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_FOUND);
        }catch (Exception e){
            responseEntity = new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return responseEntity;
    }



    @PutMapping("/user/updateBoard/{boardName}")
    public ResponseEntity<?>updateBoardName(@PathVariable String boardName,@RequestBody Board newBoardName,HttpServletRequest request) throws InvalidCredentialsException, BoardNotFoundException {
        String emailId = getUserIdFromClaims(request);
        System.out.println("emailId :: "+emailId);
        try {
            responseEntity = new ResponseEntity<>(userService.updateBoard(emailId,boardName,newBoardName), HttpStatus.OK);
        }catch (InvalidCredentialsException e){
            responseEntity = new ResponseEntity<>(e.getMessage(),HttpStatus.UNAUTHORIZED);
        }catch (BoardNotFoundException e){
            responseEntity = new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_FOUND);
        }catch (Exception e){
            responseEntity = new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return responseEntity;
  
    }
  
  
    @DeleteMapping("/user/deleteBoard/{boardName}")
    public ResponseEntity<?> deleteBoard(@PathVariable String boardName, HttpServletRequest request)  {
        Claims claims = (Claims) request.getAttribute("claims");
        String emailId = claims.getSubject();
        System.out.println("emailId :: "+emailId);
        try {
            responseEntity = new ResponseEntity<>(userService.deleteBoard(emailId,boardName), HttpStatus.OK);
        }catch (InvalidCredentialsException e){
            responseEntity = new ResponseEntity<>(e.getMessage(),HttpStatus.UNAUTHORIZED);
        }catch (BoardNotFoundException e){
            responseEntity = new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_FOUND);
        }catch (Exception e){
            responseEntity = new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return responseEntity;
    }




    @PutMapping("/user/updateTask/{boardName}/{stageName}")
    public ResponseEntity<?> updateTask(@PathVariable String boardName,@PathVariable String stageName , @RequestBody Task newTaskData , HttpServletRequest request)  {
        String emailId = getUserIdFromClaims(request);
        System.out.println("emailId :: "+emailId);
        try {
            responseEntity = new ResponseEntity<>(userService.updateTask(emailId,boardName,stageName,newTaskData), HttpStatus.OK);
        }catch (InvalidCredentialsException e){
            responseEntity = new ResponseEntity<>(e.getMessage(),HttpStatus.UNAUTHORIZED);
        }catch (BoardNotFoundException e){
            responseEntity = new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_FOUND);
        }catch (StageNotFoundException e){
            responseEntity = new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_FOUND);
        }catch (TaskNotFoundException e){
            responseEntity = new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_FOUND);
        }catch (Exception e){
            responseEntity = new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return responseEntity;
    }


    @DeleteMapping("/user/deleteTask/{boardName}/{stageName}/{taskId}")
    public ResponseEntity<?> deleteTask(@PathVariable String boardName,@PathVariable String stageName , @PathVariable String taskId , HttpServletRequest request)  {
        String emailId = getUserIdFromClaims(request);
        System.out.println("emailId :: "+emailId);
        try {
            responseEntity = new ResponseEntity<>(userService.deleteTask(emailId,boardName,stageName,taskId), HttpStatus.OK);
        }catch (InvalidCredentialsException e){
            responseEntity = new ResponseEntity<>(e.getMessage(),HttpStatus.UNAUTHORIZED);
        }catch (BoardNotFoundException e){
            responseEntity = new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_FOUND);
        }catch (StageNotFoundException e){
            responseEntity = new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_FOUND);
        }catch (TaskNotFoundException e){
            responseEntity = new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_FOUND);
        } catch (Exception e){
            responseEntity = new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return responseEntity;
    }

    @PutMapping("/user/updateUser")
    public ResponseEntity<?> updateUser(@RequestBody User updateUser ,HttpServletRequest request)  {
        String emailId = getUserIdFromClaims(request);
        System.out.println("emailId :: "+emailId);
        try {
            responseEntity = new ResponseEntity<>(userService.updateUser(emailId,updateUser), HttpStatus.OK);
        }catch (InvalidCredentialsException e){
            responseEntity = new ResponseEntity<>(e.getMessage(),HttpStatus.UNAUTHORIZED);
        } catch (Exception e){
            responseEntity = new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return responseEntity;
    }

    @PostMapping("/user/addTaskToMember/{boardName}/{taskId}")
    public ResponseEntity<?> addTaskToMember(@PathVariable String boardName , @PathVariable String taskId ,@RequestBody String memberEmailId,HttpServletRequest request)  {
        String emailId = getUserIdFromClaims(request);
        System.out.println("emailId :: "+emailId);
        try {
            responseEntity = new ResponseEntity<>(userService.addTaskToMember(emailId,memberEmailId,taskId,boardName), HttpStatus.OK);
        }catch (InvalidCredentialsException e){
            responseEntity = new ResponseEntity<>(e.getMessage(),HttpStatus.UNAUTHORIZED);
        }catch (BoardNotFoundException | TaskNotFoundException e){
            responseEntity = new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_FOUND);
        }catch (TaskLimitExceedException e){
            responseEntity = new ResponseEntity<>(e.getMessage(),HttpStatus.BAD_REQUEST);
        }catch (Exception e){
            responseEntity = new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return responseEntity;
    }

    @GetMapping("/user/getAllUserDetails")
    public ResponseEntity<?> getAllUserData(HttpServletRequest request) throws InvalidCredentialsException {
        String emailId = getUserIdFromClaims(request);
        System.out.println("emailId :: "+emailId);
        try {
            responseEntity = new ResponseEntity<>(userService.getCompleteDataOfUser(emailId), HttpStatus.OK);
        }catch (InvalidCredentialsException e){
            responseEntity = new ResponseEntity<>(e.getMessage(),HttpStatus.UNAUTHORIZED);
        }catch (Exception e){
            responseEntity = new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return  responseEntity;
    }


    @GetMapping("/user/getListOfStages/{boardName}")
    public ResponseEntity<?>getListOfStages(@PathVariable String boardName,HttpServletRequest request)
    { String emailId = getUserIdFromClaims(request);
        System.out.println("emailId :: "+emailId);
        try {
            responseEntity = new ResponseEntity<>(userService.getListOfStages(emailId,boardName), HttpStatus.OK);
        } catch (Exception e){
            responseEntity = new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return responseEntity;

    }

    @GetMapping("/user/getAllMembersOfBoard/{boardName}")
    public ResponseEntity<?> getAllMembersOfBoard( @PathVariable String boardName, HttpServletRequest request) {

        String emailId = getUserIdFromClaims(request);
        System.out.println("emailId :: "+emailId);

        try {
            List<Member> members = userService.getAllMembersOfBoard(emailId, boardName);
            return new ResponseEntity<>(members, HttpStatus.OK);
        } catch (InvalidCredentialsException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
        } catch (BoardNotFoundException | MemberNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }catch (Exception e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping("/user/getAllTasksInBoard/{boardName}")
    public ResponseEntity<?> getAllTasksInBoard( @PathVariable String boardName, HttpServletRequest request) {

        String emailId = getUserIdFromClaims(request);
        System.out.println("emailId :: "+emailId);

        try {
            List<Task> tasks = userService.getAllTasksInBoard(emailId, boardName);
            return new ResponseEntity<>(tasks, HttpStatus.OK);
        } catch (InvalidCredentialsException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
        } catch (BoardNotFoundException | StageNotFoundException | TaskNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping("/user/getListOfBoards")
    public ResponseEntity<?>  getListOfBoards(HttpServletRequest request){
        String emailId = getUserIdFromClaims(request);
        System.out.println("emailId :: "+emailId);

        try {
            List<Board> boards = userService.getListOfBoards(emailId);
            return new ResponseEntity<>(boards, HttpStatus.OK);
        } catch (InvalidCredentialsException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
        } catch (BoardNotFoundException  e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



























    // getting emailId after decrypting the token

    private String getUserIdFromClaims(HttpServletRequest request){
        Claims claims = (Claims) request.getAttribute("claims");
        System.out.println("Customer EmailID from claims :: " + claims.getSubject());
        return claims.getSubject();
    }

}
