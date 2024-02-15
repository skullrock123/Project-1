package com.niit.ApiGatewayService.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {
    @Bean
    public RouteLocator myRoute(RouteLocatorBuilder builder){
        return builder.routes()
                .route(r->r
                        .path("/api/v1/**")
                        .uri("lb://kanban-board-service/"))
                .route(r->r
                        .path("/api/v2/**")
                        .uri("lb://user-authentication-service/"))
                .route(r->r
                        .path("/api/v3/**")
                        .uri("lb://notification-service/"))
                .build();
    }
}
