package com.dataviz.backend.service.impl;

import com.dataviz.backend.exception.InvalidCsvException;
import com.dataviz.backend.model.Coordinate;
import com.dataviz.backend.service.CsvFileReader;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
public class DefaultCsvFileReader implements CsvFileReader {

    @Override
    public List<Coordinate> parseCsv(MultipartFile file) throws InvalidCsvException {
        List<Coordinate> coordinates = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {

            CSVFormat csvFormat = CSVFormat.DEFAULT.builder()
                    .setHeader()
                    .setSkipHeaderRecord(true)
                    .setTrim(true)
                    .get();

            CSVParser csvParser = csvFormat.parse(reader);

            for (CSVRecord record : csvParser) {
                try {
                    double x = Double.parseDouble(record.get("x"));
                    double y = Double.parseDouble(record.get("y"));
                    double z = Double.parseDouble(record.get("z"));
                    Coordinate coordinate = new Coordinate(x, y, z);
                    coordinates.add(coordinate);
                } catch (NumberFormatException e) {
                    throw new InvalidCsvException(
                            String.format("Valore numerico non valido alla riga %d: %s",
                                    record.getRecordNumber(), record.toString()));
                }
            }

        } catch (IOException e) {
            throw new InvalidCsvException("Errore nella lettura del file CSV");
        } catch (IllegalArgumentException e) {
            throw new InvalidCsvException("Formattazione CSV non valida o header mancante.");
        }

        return coordinates;
    }
}
