package com.dataviz.backend.service.impl;

import com.dataviz.backend.service.CsvFileReader;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class DefaultCsvFileReader implements CsvFileReader {

    @Override
    public Object parseCsv(MultipartFile file) {
        //usare BufferedReader o altro ? (forse altra libreria ?)
        return new Object();
    }
}
