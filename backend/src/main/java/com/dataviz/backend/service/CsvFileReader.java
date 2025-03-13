package com.dataviz.backend.service;

import com.dataviz.backend.exception.InvalidCsvException;
import com.dataviz.backend.model.Coordinate;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface CsvFileReader {
    List<Coordinate> parseCsv(MultipartFile file) throws InvalidCsvException;
}
