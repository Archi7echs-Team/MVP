package com.dataviz.backend.controller;

import com.dataviz.backend.model.MatrixData;
import com.dataviz.backend.service.ExternalDataService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ExternalDataController {

    private final ExternalDataService externalDataService;

    public ExternalDataController(ExternalDataService externalDataService) {
        this.externalDataService = externalDataService;
    }

    @GetMapping("/external/data")
    public MatrixData fetchExternalData() {
        return externalDataService.fetchData();
    }
}