package com.dataviz.backend.service;

public interface CsvFileReader {
    //Che oggetto ritorna ?
    Object parseCsv(org.springframework.web.multipart.MultipartFile file);
}
