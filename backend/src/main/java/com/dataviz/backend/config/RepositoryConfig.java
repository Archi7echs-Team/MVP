package com.dataviz.backend.config;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories(basePackages = "com.dataviz.backend.repository")
@EntityScan("com.dataviz.backend.model")
public class RepositoryConfig {
}