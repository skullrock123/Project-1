package com.niit.KanbanBoardService.service;


import com.niit.KanbanBoardService.domian.*;
import com.niit.KanbanBoardService.exception.*;
import com.niit.KanbanBoardService.proxy.UserAuthProxy;
import com.niit.KanbanBoardService.proxy.UserMailProxy;
import com.niit.KanbanBoardService.repository.*;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import org.springframework.core.io.Resource;

import javax.management.Query;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.*;

import static org.springframework.data.mongodb.core.FindAndModifyOptions.options;
import static org.springframework.data.mongodb.core.query.Criteria.where;
import static org.springframework.data.mongodb.core.query.Query.query;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserAuthProxy userAuthProxy;
    @Autowired
    private UserMailProxy userMailProxy;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BoardRepository boardRepository;
    @Autowired
    private StageRepository stageRepository;
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private MemberRepository memberRepository;
    @Autowired
    private MongoOperations mongoOperations;

    @Override
    public User saveUser(User user) throws UserAlreadyExistsException {

        if (userRepository.findById(user.getEmailId()).isPresent()) {
            throw new UserAlreadyExistsException();
        }
        //<------------UserProxy---For---Auth---Service--------->
        User savedUser = userRepository.save(user);

        //<------------EmailProxy---For---Notification---Service--------->
        String msgBody = "Congratulations, "+savedUser.getUsername()+ " ! \n You have Successfully Registered with KanBan Application";
        String subject = "You Profile Is Created ..";

        EmailDataWithoutAttachment emailData = new EmailDataWithoutAttachment(savedUser.getEmailId(), msgBody,subject);


        if (!(savedUser.getEmailId().isEmpty())) {

            ResponseEntity response1 = userAuthProxy.saveUser(savedUser);
            //String response2 = userMailProxy.sendUserDataToMailWithAttachment(userDTO);
            userMailProxy.sendMail(emailData);
            System.out.println(response1.getBody());
            //System.out.println(response2);

        }
        return savedUser;
    }

    @Override
    public User updateUser(String emailId, User user) throws InvalidCredentialsException {

        User existingUser = userRepository.findById(emailId).get();

        if (existingUser == null) {
            throw new InvalidCredentialsException();
        }
        // Copy the non-null properties from updatedUserData to existingUser
        BeanUtils.copyProperties(user, existingUser, "emailId", "password", "myBoards","userImage");

        // Save the updated user
        return userRepository.save(existingUser);
    }


    @Override
    public Board createNewBoard(Board board, String emailId) throws InvalidCredentialsException, BoardAlreadyExistsException, IOException {
        //access current login user
        // create new board
        User user = userRepository.findById(emailId).get();
        if (user == null) {
            throw new InvalidCredentialsException();
        }
        List<Board> userBoard;
        if (user.getMyBoards() != null) {
            userBoard = user.getMyBoards();
        } else {
            userBoard = new ArrayList<>();
        }
        boolean boardIsPresent = false;
        for (Board b : userBoard) {
            if (b.getBoardName().equals(board.getBoardName())) {
                boardIsPresent = true;
            }
        }
        if (boardIsPresent) {
            throw new BoardAlreadyExistsException();
        }
        userBoard.add(board);
        user.setMyBoards(userBoard);
        userRepository.save(user);
        //---------------------------------------
        String msg = board.getBoardName()+" board is created successfully !";
        String sub = "Board Created....";
        String attch = "D:\\NIIT\\Capstone Latest Project\\SE-Capstone-Project\\KanbanBoard\\KanbanBoardService\\src\\main\\resources\\images\\thankYou.jpg";

        EmailData userDto = new EmailData(emailId,msg,sub,attch);
        userMailProxy.sendUserDataToMailWithAttachment(userDto);
        return boardRepository.save(board);
    }

    @Override
    public Board updateBoard(String emailId, String boardName, Board newBoardName) throws InvalidCredentialsException, BoardNotFoundException {

        // Retrieve the user from the userRepository
        System.out.println("Updating board: emailId=" + emailId + ", boardName=" + boardName + ", newBoardName=" + newBoardName.getBoardName());

        // Retrieve the user from the userRepository
        User user = userRepository.findById(emailId).get();

        // Check if the user exists
        if (user == null) {
            throw new InvalidCredentialsException();
        }

        // Retrieve the list of boards for the user
        List<Board> boardList = user.getMyBoards();

        System.out.println(boardList);

        // Check if the boardList is null (assuming it can be null)
        if (boardList == null) {
            throw new BoardNotFoundException();
        }

        Board updatedBoard = null;
        // Iterate through the user's boards to find the board to update
        for (Board board : boardList) {
            if (board.getBoardName().equals(boardName)) {
                System.out.println("Updating board name from '" + boardName + "' to '" + newBoardName.getBoardName() + "'");
                board.setBoardName(newBoardName.getBoardName());
                updatedBoard = board;
                break;
            }
        }

        System.out.println("updatedBoard :: " + updatedBoard);
        //  Set the updated list of boards to the user
        user.setMyBoards(boardList);

        // Save the changes to the user in the userRepository
        userRepository.save(user);

        // Check if an update was performed
        if (updatedBoard != null) {
            // Save the updated board in the boardRepository
            boardRepository.deleteById(boardName);
            Board savedBoard = boardRepository.save(updatedBoard);
            return savedBoard;
        } else {
            // If no board was updated, throw a BoardNotFoundException
            throw new BoardNotFoundException();
        }
    }

    @Override
    public boolean deleteBoard(String emailId, String boardName) throws InvalidCredentialsException, BoardNotFoundException {

        // Check for valid user
        User user = userRepository.findById(emailId).get();
        if (user == null) {
            throw new InvalidCredentialsException();
        }
        List<Board> userBoards = user.getMyBoards();
        if (userBoards == null) {
            throw new BoardNotFoundException();
        }

        boolean boardDeleted = false;
        Board targetBoard = null;

        Iterator<Board> iterator = userBoards.iterator();
        while (iterator.hasNext()) {
            Board board = iterator.next();
            if (board.getBoardName().equals(boardName)) {
                targetBoard = board;
                iterator.remove();
                boardDeleted = true;
                break;
            }
        }

        if (targetBoard == null) {
            throw new BoardNotFoundException();
        }
        //user.setMyBoards(userBoards);
        // Save the changes
        boardRepository.delete(targetBoard);
        userRepository.save(user);
        return boardDeleted;
    }



    // Adding list of stages to a particular board
    @Override
    public List<Stage> addStagesIntoBoard(String boardName, List<Stage> myStages, String emailId)
            throws InvalidCredentialsException, StageAlreadyExistException, BoardNotFoundException {

        User user = userRepository.findById(emailId).get();
        if (user == null) {
            throw new InvalidCredentialsException();
        }

        List<Board> userBoards = user.getMyBoards();
        if (userBoards == null) {
            throw new BoardNotFoundException();
        }

        for (Board userBoard : userBoards) {
            if (userBoard.getBoardName().equals(boardName)) {
                List<Stage> userBoardStages = userBoard.getMyStages();
                if (userBoardStages == null) {
                    userBoardStages = new ArrayList<>();
                }

                for (Stage stage : myStages) {
                    if (userBoardStages.stream().anyMatch(s -> s.getStageName().equals(stage.getStageName()))) {
                        throw new StageAlreadyExistException();
                    }
                    stage.setMyTasks(new ArrayList<>());
                    userBoardStages.add(stage);
                }

                userBoard.setMyStages(userBoardStages);
                boardRepository.save(userBoard);
            }
        }

        user.setMyBoards(userBoards);
        userRepository.save(user);

        return stageRepository.saveAll(myStages);
    }

    @Override
    public List<Member> addMembersInBoard(String boardName, List<Member> boardMembers, String emailId) throws InvalidCredentialsException, BoardNotFoundException, MemberAlreadyExistException {
        // access current login user
        // access the board of that user
        // add members into it
        User user = userRepository.findById(emailId).get();
        if (user == null) {
            throw new InvalidCredentialsException();
        }

        List<Board> userBoards = user.getMyBoards();
        if (userBoards == null) {
            throw new BoardNotFoundException();
        }

        for (Board board : userBoards) {
            if (board.getBoardName().equals(boardName)) {
                List<Member> existingMembers = board.getBoardMembers();
                boolean memberIsPresent = false;

                if (existingMembers != null) {
                    for (Member member : boardMembers) {
                        if (existingMembers.stream().anyMatch(m -> m.getMemberEmailId().equals(member.getMemberEmailId()))) {
                            memberIsPresent = true;
                            break;
                        }
                    }

                    if (memberIsPresent) {
                        throw new MemberAlreadyExistException();
                    }
                } else {
                    existingMembers = new ArrayList<>();
                }

                existingMembers.addAll(boardMembers);
                board.setBoardMembers(existingMembers);
                boardRepository.save(board);
            }
        }

        user.setMyBoards(userBoards);
        userRepository.save(user);
        for (Member member:boardMembers){
            String msg = "You have been added to the "+boardName+" board by "+user.getUsername();
            String sub = " Added to Board....";
            EmailDataWithoutAttachment mailData = new EmailDataWithoutAttachment(member.getMemberEmailId(),msg,sub);
            userMailProxy.sendMail(mailData);
        }

        return memberRepository.saveAll(boardMembers);
    }


    @Override
    public Task createNewTask(String boardName, String stageName, Task task, String emailId) throws InvalidCredentialsException, BoardNotFoundException, StageNotFoundException, TaskAlreadyExistException {
        // access current login user
        // access the board of that user
        // for the first time :
        // access first stage using stage name and add the task into it

        User user = userRepository.findById(emailId).get();
        if (user == null) {
            throw new InvalidCredentialsException();
        }
        List<Board> userBoard = user.getMyBoards();
        if (userBoard == null) {
            throw new BoardNotFoundException();
        }
        Board targetBoard = null;
        for (Board board : userBoard) {
            if (board.getBoardName().equals(boardName)) {
                targetBoard = board;
                break;
            }
        }
        if (targetBoard == null) {
            throw new BoardNotFoundException();
        }
        List<Stage> stageList = targetBoard.getMyStages();
        if (stageList == null) {
            throw new StageNotFoundException();
        }
        if(task.getPriority().isEmpty()){
            task.setPriority("Normal");
        }
        task.setCreationDateTime(new Date());
        Stage targetStage = null;
        for (Stage stage : stageList) {
            if (stage.getStageName().equals(stageName)) {
                targetStage = stage;
                break;
            }
        }
        List<Task> taskList = targetStage.getMyTasks();
        if (taskList == null) {
            taskList = new ArrayList<>();

        }
        taskList.add(task);
        targetStage.setMyTasks(taskList);
        targetBoard.setMyStages(stageList);
        boardRepository.save(targetBoard);
        userRepository.save(user);
        stageRepository.saveAll(stageList);
        return taskRepository.save(task);

    }

    @Override
    public Task updateTask(String emailId, String boardName, String stageName, Task newTaskData) throws InvalidCredentialsException, TaskNotFoundException, BoardNotFoundException, StageNotFoundException {

        User user = userRepository.findById(emailId).get();
        if (user == null) {
            throw new InvalidCredentialsException();
        }
        for (Board board : user.getMyBoards()) {
            if (board == null) {
                throw new BoardNotFoundException();
            }
            if (board.getBoardName().equals(boardName)) {
                for (Stage stage : board.getMyStages()) {
                    if (stage == null) {
                        throw new StageNotFoundException();
                    }
                    if (stage.getStageName().equals(stageName)) {

                        for (Task task : stage.getMyTasks()) {
                            if (task.getTaskId().equals(newTaskData.getTaskId())) {
                                // Update task data
                                if (newTaskData.getTaskName() != null) {
                                    task.setTaskName(newTaskData.getTaskName());
                                }
                                if (newTaskData.getTaskDescription() != null) {
                                    task.setTaskDescription(newTaskData.getTaskDescription());
                                }
                                if (newTaskData.getPriority() != null) {
                                    task.setPriority(newTaskData.getPriority());
                                }



                                // Add other fields as needed
                                taskRepository.save(task);
                                userRepository.save(user);
                                boardRepository.save(board);
                                stageRepository.save(stage);

                                return task;
                            }
                        }
                    }
                }
            }
        }

        throw new TaskNotFoundException();
    }

    @Override
    public boolean deleteTask(String emailId, String boardName, String stageName, String taskId) throws TaskNotFoundException, InvalidCredentialsException, BoardNotFoundException, StageNotFoundException {
        Optional<User> userOptional = userRepository.findById(emailId);
        if (userOptional.isEmpty()) {
            throw new InvalidCredentialsException();
        }
        if (userOptional.isPresent()) {
            User user = userOptional.get();

            for (Board board : user.getMyBoards()) {
                if (board == null) {
                    throw new BoardNotFoundException();
                }
                if (board.getBoardName().equals(boardName)) {
                    for (Stage stage : board.getMyStages()) {
                        if (stage == null) {
                            throw new StageNotFoundException();
                        }
                        if (stage.getStageName().equals(stageName)) {
                            List<Task> tasks = stage.getMyTasks();
                            Iterator<Task> iterator = tasks.iterator();

                            while (iterator.hasNext()) {
                                Task task = iterator.next();
                                if (task.getTaskId().equals(taskId)) {
                                    iterator.remove();

                                    // Save changes to the database
                                    userRepository.save(user);
                                    boardRepository.save(board);
                                    stageRepository.save(stage);

                                    // Delete the task from TaskRepository
                                    taskRepository.deleteById(taskId);

                                    return true; // Task deleted successfully
                                }
                            }
                        }
                    }
                }
            }
        }
        throw new TaskNotFoundException();
        // Task not found or deletion failed

    }

    @Override
    public Member addTaskToMember(String emailId, String memberEmailId, String taskId, String boardName) throws InvalidCredentialsException, BoardNotFoundException, TaskNotFoundException, TaskLimitExceedException {
        User user = userRepository.findById(emailId).get();
        if (user == null) {
            throw new InvalidCredentialsException();
        }
        List<Board> userBoard = user.getMyBoards();
        if (userBoard == null) {
            throw new BoardNotFoundException();
        }

        for (Board board : user.getMyBoards()) {
            boolean assignStatus = false;
            if (board.getBoardName().equals(boardName)) {
                List<Member> myMembers = board.getBoardMembers();
                Iterator<Member> iterator = myMembers.iterator();
                while (iterator.hasNext()) {
                    Member targetMember = iterator.next();
                    if (targetMember.getMemberEmailId().equals(memberEmailId)) {

                        if (targetMember.getMyTask() == null) {
                            targetMember.setMyTask(new ArrayList<>());
                        }
                        Task task = taskRepository.findById(taskId).get();
                        if (task == null) {
                            throw new TaskNotFoundException();
                        }
                        if (targetMember.getMyTask().size() <= 2) {
                            task.setAssigned(true);
                            assignStatus = true;
                            if (!targetMember.getMyTask().contains(task)) {
                                targetMember.getMyTask().add(task);

                                String msg = "The following task has been assigned to you : \n"+task.getTaskName()+"\n Task Description: "+task.getTaskDescription();
                                String sub = " Assign Task to Member....";
                                EmailDataWithoutAttachment mailData = new EmailDataWithoutAttachment(targetMember.getMemberEmailId(),msg,sub);
                                userMailProxy.sendMail(mailData);
                            }

                        } else {
                            throw new TaskLimitExceedException();
                        }


                        memberRepository.save(targetMember);
                    }
                }
                board.setBoardMembers(myMembers);
                boardRepository.save(board);
            }

            if (assignStatus) {
                if (board.getMyStages() != null) {
                    for (Stage stage : board.getMyStages()) {
                        if (stage.getMyTasks() != null) {
                            for (Task task : stage.getMyTasks()) {
                                if (task.getTaskId().equals(taskId)) {
                                    task.setAssigned(true);
                                    taskRepository.save(task);

                                }

                            }
                        }
                    }
                }

            }
        }


        userRepository.save(user);
        return memberRepository.findById(memberEmailId).get();
    }




    @Override
    public User moveTaskToAnotherStage(String emailId, String boardName, String fromStage, String toStage, Task mytask) throws InvalidCredentialsException, BoardNotFoundException, TaskNotFoundException, StageNotFoundException {


        User user = userRepository.findById(emailId).get();
        if (user == null) {
            throw new InvalidCredentialsException();
        }

        List<Board> userBoards = user.getMyBoards();
        if (userBoards == null || userBoards.isEmpty()) {
            throw new BoardNotFoundException();
        }

        Board targetBoard = userBoards.stream().filter(board -> board.getBoardName().equals(boardName)).findFirst().orElse(null);
        if (targetBoard == null) {
            throw new BoardNotFoundException();
        }

        List<Stage> targetBoardStages = targetBoard.getMyStages();
        if (targetBoardStages == null) {
            targetBoardStages = new ArrayList<>();
        }

        Stage currentStage = null;
        for (Stage stage : targetBoardStages) {
            if (stage.getStageName().equals(fromStage)) {
                currentStage = stage;
                break;
            }
        }
        if (currentStage == null) {
            throw new StageNotFoundException();
        }

        Stage targetStage = null;
        for (Stage stage : targetBoardStages) {
            if (stage.getStageName().equals(toStage)) {
                targetStage = stage;
                break;
            }
        }
        if (targetStage == null) {
            throw new StageNotFoundException();
        }

        Task taskToMove = null;
        List<Task> currentStageTasks = currentStage.getMyTasks();
        if (currentStageTasks != null) {
            for (Task task : currentStageTasks) {
                if (task.getTaskId().equals(mytask.getTaskId())) {
                    taskToMove = task;
                    break;
                }
            }
        }
        if (taskToMove == null) {
            throw new TaskNotFoundException();
        }

        List<Task> targetStageTasks = targetStage.getMyTasks();
        if (targetStageTasks == null) {
            targetStageTasks = new ArrayList<>();
        }
        targetStageTasks.add(taskToMove);
        targetStage.setMyTasks(targetStageTasks);

        List<Task> updatedCurrentStageTasks = new ArrayList<>();
        if (currentStageTasks != null) {
            for (Task task : currentStageTasks) {
                if (!task.getTaskId().equals(mytask.getTaskId())) {
                    updatedCurrentStageTasks.add(task);
                }
            }
        }
        currentStage.setMyTasks(updatedCurrentStageTasks);



        List<Stage> updatedStages = new ArrayList<>(targetBoard.getMyStages());
        updatedStages.removeIf(stage ->
                stage.getStageName().equals(fromStage) || stage.getStageName().equals(toStage));
        updatedStages.add(currentStage);
        updatedStages.add(targetStage);
        updatedStages.sort(Comparator.comparingInt(stage ->
                targetBoard.getMyStages().indexOf(stage)));

        targetBoard.setMyStages(updatedStages);

        boardRepository.save(targetBoard);
        stageRepository.saveAll(updatedStages);


        return userRepository.save(user);

    }



    @Override
    public User getCompleteDataOfUser(String emailId) throws InvalidCredentialsException {
        User user = userRepository.findById(emailId).get();
        if (user == null) {
            throw new InvalidCredentialsException();
        }
        return user;
    }


    @Override
    public List<Stage> getListOfStages(String emailId, String boardName) throws Exception {
        User user=userRepository.findById(emailId).get();
        if(user==null) {
            throw new InvalidCredentialsException();
        }
        List<Board> boardList=user.getMyBoards();
        if(boardList==null) {
            throw new BoardNotFoundException();
        }
        Board targetBoard=null;

        Iterator<Board> iter=boardList.iterator();
        while(iter.hasNext()) {
            Board board=iter.next();
            if(board.getBoardName().equals(boardName))
            {
                targetBoard=board;
            }
        }
        if(targetBoard==null) {
            throw new BoardNotFoundException();
        }

        List<Stage> stageList=targetBoard.getMyStages();
        if(stageList==null) {
            throw  new StageNotFoundException();

        }
        return  stageList;
    }

    // Get all members
    @Override
    public List<Member> getAllMembersOfBoard(String emailId, String boardName) throws InvalidCredentialsException, BoardNotFoundException, MemberNotFoundException {
        User user = userRepository.findById(emailId).get();
        if (user == null) {
            throw new InvalidCredentialsException();
        }

        List<Board> userBoards = user.getMyBoards();

        if (userBoards == null) {
            throw new BoardNotFoundException();
        }

        for (Board board : userBoards) {
            if (board.getBoardName().equals(boardName)) {
                if (board.getBoardMembers() != null){
                    return board.getBoardMembers();
                }else {
                    throw new MemberNotFoundException();
                }

            }
        }

        throw new BoardNotFoundException();
    }

    // Get all tasks from all stages
    @Override
    public List<Task> getAllTasksInBoard(String emailId, String boardName) throws InvalidCredentialsException, BoardNotFoundException, StageNotFoundException, TaskNotFoundException {
        User user = userRepository.findById(emailId).get();
        if (user == null) {
            throw new InvalidCredentialsException();
        }
        List<Board> userBoards = user.getMyBoards();

        if (userBoards == null) {
            throw new BoardNotFoundException();
        }

        for (Board board : userBoards) {
            if (board.getBoardName().equals(boardName)) {
                List<Task> allTasks = new ArrayList<>();

                if (board.getMyStages() != null) {
                    for (Stage stage : board.getMyStages()) {
                        if (stage.getMyTasks() != null) {
                            allTasks.addAll(stage.getMyTasks());
                        }
                    }
                }else {
                    throw new StageNotFoundException();
                }

                if (allTasks.isEmpty()){
                    throw new TaskNotFoundException();
                }

                return allTasks;
            }
        }

        throw new BoardNotFoundException();
    }

    @Override
    public List<Board> getListOfBoards(String emailId) throws InvalidCredentialsException, BoardNotFoundException {
        User user=userRepository.findById(emailId).get();
        if(user==null) {
            throw new InvalidCredentialsException();
        }
        List<Board> boardList=user.getMyBoards();
        if(boardList==null) {
            throw new BoardNotFoundException();
        }
        return boardList;
    }


//*******************************************
    @Override
    public String  generateSequence(String seqName) {
        TaskSequence counter = mongoOperations.findAndModify(query(where("_id").is(seqName)),
                new Update().inc("seq",1), options().returnNew(true).upsert(true),
                TaskSequence.class);
        int seqNo = !Objects.isNull(counter) ? counter.getSeq() : 1;
        return String.valueOf(seqNo);
    }

}
