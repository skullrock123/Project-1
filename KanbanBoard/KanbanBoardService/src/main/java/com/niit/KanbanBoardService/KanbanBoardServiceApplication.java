package com.niit.KanbanBoardService;

import com.niit.KanbanBoardService.filter.JWTFilter;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@EnableEurekaClient
@EnableFeignClients
public class KanbanBoardServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(KanbanBoardServiceApplication.class, args);
		System.out.println("Kanban app running....");
	}

	@Bean
	public FilterRegistrationBean jwtFilter(){
		FilterRegistrationBean frb = new FilterRegistrationBean<>();
		frb.setFilter(new JWTFilter());
		frb.addUrlPatterns("/api/v1/user/*");
		return frb;
	}

}
