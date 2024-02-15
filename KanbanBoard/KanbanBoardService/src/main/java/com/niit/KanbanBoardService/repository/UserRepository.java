package com.niit.KanbanBoardService.repository;


import com.niit.KanbanBoardService.domian.Task;
import com.niit.KanbanBoardService.domian.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface UserRepository extends MongoRepository<User,String> {



}
