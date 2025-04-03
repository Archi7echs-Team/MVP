package com.dataviz.backend.controller;

import com.dataviz.backend.exception.FileTooBigException;
import com.dataviz.backend.exception.InvalidCsvException;
import com.dataviz.backend.model.MatrixData;
import com.dataviz.backend.service.CsvFileReader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api")
public class UploadController {


    private final CsvFileReader csvFileReader;

    @Autowired
    public UploadController(CsvFileReader csvFileReader) {
        this.csvFileReader = csvFileReader;
    }

    @PostMapping("/uploadCsv")
    public ResponseEntity<?> uploadCsv(@RequestParam("file") MultipartFile file) {
        MatrixData csvParsed = csvFileReader.parseCsv(file);
        return ResponseEntity.ok("File uploaded and parsed successfully.");
    }
}
