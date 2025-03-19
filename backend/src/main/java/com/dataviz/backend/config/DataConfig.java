package com.dataviz.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@Configuration
@EnableConfigurationProperties(DataProprieties.class)
public class DataConfig { }
