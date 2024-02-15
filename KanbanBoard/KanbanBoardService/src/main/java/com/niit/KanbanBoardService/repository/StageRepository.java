package com.niit.KanbanBoardService.repository;


import com.niit.KanbanBoardService.domian.Stage;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface StageRepository extends MongoRepository<Stage,String> {
}
