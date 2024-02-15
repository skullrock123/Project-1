package com.niit.KanbanBoardService.repository;


import com.niit.KanbanBoardService.domian.Board;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface BoardRepository extends MongoRepository<Board,String> {
}
