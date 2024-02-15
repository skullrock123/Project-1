package com.niit.KanbanBoardService.service;


import com.niit.KanbanBoardService.domian.*;
import com.niit.KanbanBoardService.exception.*;

import java.io.IOException;
import java.util.List;


public interface UserService {

    User saveUser(User user) throws UserAlreadyExistsException;

    Board createNewBoard(Board board, String emailId) throws InvalidCredentialsException, BoardAlreadyExistsException, IOException;


    public List<Stage> addStagesIntoBoard(String boardName, List<Stage> myStages, String emailId)
            throws InvalidCredentialsException, StageAlreadyExistException, BoardNotFoundException;

    Task createNewTask(String boardName, String stageName, Task task, String emailId) throws InvalidCredentialsException, BoardNotFoundException, StageNotFoundException, TaskAlreadyExistException;

    User moveTaskToAnotherStage(String emailId, String boardName, String fromStage, String toStage, Task task) throws InvalidCredentialsException, BoardNotFoundException, TaskNotFoundException, StageNotFoundException;

    Board updateBoard(String emailId, String boardName, Board newBoardName) throws InvalidCredentialsException, BoardNotFoundException;
   

    boolean deleteBoard(String emailId,String boardName) throws InvalidCredentialsException, BoardNotFoundException;

    Task updateTask(String emailId, String boardName ,String stageName, Task newTaskData) throws InvalidCredentialsException, TaskNotFoundException, BoardNotFoundException, StageNotFoundException;

    boolean deleteTask(String emailId, String boardName , String stageName , String taskId) throws InvalidCredentialsException, BoardNotFoundException, StageNotFoundException ,TaskNotFoundException ;

    User updateUser(String emailId ,User user) throws InvalidCredentialsException;

    Member addTaskToMember(String emailId, String memberEmailId, String taskId, String boardName) throws InvalidCredentialsException, BoardNotFoundException, TaskNotFoundException, TaskLimitExceedException;
    User getCompleteDataOfUser(String emailId) throws InvalidCredentialsException;

    List<Stage> getListOfStages(String emailId,String boardName) throws Exception;

    List<Member> addMembersInBoard(String boardName, List<Member> boardMembers, String emailId) throws InvalidCredentialsException, BoardNotFoundException, MemberAlreadyExistException;

    List<Member> getAllMembersOfBoard(String emailId, String boardName) throws InvalidCredentialsException, BoardNotFoundException, MemberNotFoundException;

    List<Board> getListOfBoards(String emailId) throws InvalidCredentialsException, BoardNotFoundException;
    List<Task> getAllTasksInBoard(String emailId, String boardName) throws InvalidCredentialsException, BoardNotFoundException, StageNotFoundException, TaskNotFoundException;
    public String generateSequence(String seqName);

}
