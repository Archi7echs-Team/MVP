package com.dataviz.backend.service;

import com.dataviz.backend.exception.InvalidCsvException;
import com.dataviz.backend.model.MatrixData;
import org.springframework.web.multipart.MultipartFile;

public interface CsvFileReader {
    MatrixData parseCsv(MultipartFile file) throws InvalidCsvException;
}
