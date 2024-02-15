package com.niit.KanbanBoardService.repository;


import com.niit.KanbanBoardService.domian.Member;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MemberRepository extends MongoRepository<Member,String> {
}
