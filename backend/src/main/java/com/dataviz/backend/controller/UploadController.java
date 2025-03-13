package com.dataviz.backend.controller;

import com.dataviz.backend.exception.FileTooBigException;
import com.dataviz.backend.exception.InvalidCsvException;
import com.dataviz.backend.model.Coordinate;
import com.dataviz.backend.service.CsvFileReader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api")
public class UploadController {

    private static final long MAX_FILE_SIZE = 10L * 1024L * 1024L; // 10MB
    private final CsvFileReader csvFileReader;

    @Autowired
    public UploadController(CsvFileReader csvFileReader) {
        this.csvFileReader = csvFileReader;
    }

    @PostMapping("/uploadCsv")
    public ResponseEntity<?> uploadCsv(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            throw new InvalidCsvException("File is empty.");
        }

        if (!"text/csv".equalsIgnoreCase(file.getContentType())) {
            throw new InvalidCsvException("Invalid file type. Only .csv is allowed.");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new FileTooBigException("File exceeds 10MB limit.");
        }

        List<Coordinate> coordinates = csvFileReader.parseCsv(file);
        return ResponseEntity.ok("File uploaded and parsed successfully.");
    }
}
