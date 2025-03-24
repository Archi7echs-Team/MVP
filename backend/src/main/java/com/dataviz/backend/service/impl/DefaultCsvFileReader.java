package com.dataviz.backend.service.impl;

import com.dataviz.backend.config.DataProprieties;
import com.dataviz.backend.exception.FileTooBigException;
import com.dataviz.backend.exception.InvalidCsvException;
import com.dataviz.backend.exception.TooMuchDataException;
import com.dataviz.backend.model.MatrixData;
import com.dataviz.backend.model.impl.MatrixDataImpl;
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
    private final DataProprieties properties;

    public DefaultCsvFileReader(DataProprieties properties) {
        this.properties = properties;
    }
    /**
     * Legge un CSV strutturato come in figura:
     *   - A1 vuoto (o ignorato)
     *   - Prima riga (B1, C1, D1, ...) -> label X
     *   - Prima colonna (A2, A3, A4, ...) -> label Z
     *   - Celle di incrocio -> valori Y
     *
     * Ritorna un MatrixData contenente:
     *   - xLabels
     *   - zLabels
     *   - yValues (matrice double con dimensione zLabels.size() × xLabels.size()).
     *
     * Lancia InvalidCsvException se:
     *   - Campi vuoti (eccetto A1 nella prima riga)
     *   - Valori Y non numerici
     *   - File troppo piccolo o mismatch di colonne
     *   - Errori di I/O
     */
    @Override
    public MatrixData parseCsv(MultipartFile file) throws InvalidCsvException {
        if (file.isEmpty()) {
            throw new InvalidCsvException("File is empty.");
        }

        if (!"text/csv".equalsIgnoreCase(file.getContentType())) {
            throw new InvalidCsvException("Invalid file type. Only .csv is allowed.");
        }

        if (file.getSize() > properties.getMaxFileSize()) {
            throw new FileTooBigException("File exceeds 10MB limit.");
        }

        List<List<String>> table = readCsvAsTable(file);
        // Estrae le xLabels dalla prima riga (ignorando il primo campo, A1)
        List<String> xLabels = getXLabels(table);
        // Controlla che non ci siano più di 'maxVal' colonne X
        if (xLabels.size() > properties.getMaxColsRows()) {
            throw new InvalidCsvException("Troppe colonne X. Massimo" + properties.getMaxColsRows() + "colonne.");
        }
        int zCount = table.size() - 1;
        if (zCount > properties.getMaxColsRows()) {
            throw new InvalidCsvException("Troppe righe Z. Massimo" + properties.getMaxColsRows() + "righe.");
        }
        if (xLabels.size() * zCount > properties.getMaxNumData()) {
            throw new TooMuchDataException("Troppi dati nel file. Massimo" + properties.getMaxNumData() + "valori.");
        }
        // Prepara le strutture per Z e Y
        List<String> zLabels = new ArrayList<>();
        double[][] yValues = new double[table.size() - 1][xLabels.size()];

        // Elaborazione delle righe successive
        for (int rowIndex = 1; rowIndex < table.size(); rowIndex++) {
            List<String> row = table.get(rowIndex);
            if (row.size() != xLabels.size() + 1) {
                throw new InvalidCsvException(String.format(
                        "Numero di colonne non valido alla riga %d. Attese %d, trovate %d.",
                        rowIndex + 1, xLabels.size() + 1, row.size()));
            }
            // La prima colonna è la label Z
            String zLabel = row.get(0);
            zLabels.add(zLabel);
            // Le colonne successive sono i valori Y, da convertire in double
            for (int colIndex = 1; colIndex < row.size(); colIndex++) {
                String cellValue = row.get(colIndex);
                try {
                    double val = Double.parseDouble(cellValue);
                    yValues[rowIndex - 1][colIndex - 1] = val;

                } catch (NumberFormatException e) {
                    throw new InvalidCsvException(String.format(
                            "Valore non numerico alla riga %d, colonna %d: '%s'",
                            rowIndex + 1, colIndex + 1, cellValue));
                }
            }
        }

        return new MatrixDataImpl(xLabels, zLabels, yValues);
    }
    /**
     * Estrae le xLabels dalla prima riga della tabella (ignorando la prima cella).
     */
    private static List<String> getXLabels(List<List<String>> table) {
        if (table.size() < 2) {
            throw new InvalidCsvException("Il CSV deve contenere almeno 2 righe: 1 di header X e 1 di dati Z.");
        }
        List<String> firstRow = table.get(0);
        if (firstRow.size() < 2) {
            throw new InvalidCsvException("La prima riga deve avere almeno 2 colonne (A1 vuota e X labels).");
        }
        // Ignora la prima cella e restituisce le etichette X
        return new ArrayList<>(firstRow.subList(1, firstRow.size()));
    }

    /**
     * Legge l'intero CSV in una lista di liste di stringhe.
     * Lancia InvalidCsvException se si trovano campi vuoti (con eccezione della cella A1 nella prima riga) o errori di I/O.
     */
    private List<List<String>> readCsvAsTable(MultipartFile file) throws InvalidCsvException {
        List<List<String>> table = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {

            CSVFormat csvFormat = CSVFormat.DEFAULT.builder()
                    .setTrim(true)
                    .get();

            CSVParser csvParser = csvFormat.parse(reader);

            for (CSVRecord record : csvParser) {
                List<String> row = getStrings(record);
                table.add(row);
            }

        } catch (IOException e) {
            throw new InvalidCsvException("Errore nella lettura del file CSV");
        }
        return table;
    }

    /**
     * Converte un CSVRecord in una lista di stringhe.
     * Per la prima riga (recordNumber == 1), ignora la validazione del primo campo (A1) in quanto atteso vuoto.
     * Per le altre righe, ogni campo deve essere non vuoto.
     */
    private static List<String> getStrings(CSVRecord record) {
        List<String> row = new ArrayList<>();
        for (int i = 0; i < record.size(); i++) {
            String field = record.get(i);
            // Se siamo nella prima riga e nel primo campo, lo aggiungiamo anche se vuoto
            if (record.getRecordNumber() == 1 && i == 0) {
                row.add(field != null ? field.trim() : "");
            } else {
                if (field == null || field.trim().isEmpty()) {
                    throw new InvalidCsvException(String.format(
                            "Campo vuoto rilevato alla riga %d, colonna %d: %s",
                            record.getRecordNumber(), i + 1, record.toString()));
                }
                row.add(field.trim());
            }
        }
        return row;
    }

}
