package com.niit.KanbanBoardService.repository;


import com.niit.KanbanBoardService.domian.Task;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TaskRepository extends MongoRepository<Task,String> {
}
