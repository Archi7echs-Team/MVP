package com.dataviz.backend.controller;

import com.dataviz.backend.model.MatrixData;
import com.dataviz.backend.service.CoordinateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api")
public class CoordinateController {

    private final CoordinateService coordinateService;

    public CoordinateController(CoordinateService coordinateService) {
        this.coordinateService = coordinateService;
    }

    @GetMapping("/coordinates")
    public MatrixData getMatrixData(@RequestParam(required = false, defaultValue = "LARGE") String datasetType) {
        // Esempio: http://localhost:8080/api/coordinates?datasetType=SMALL
        return coordinateService.getCoordinates(datasetType);
    }
}
