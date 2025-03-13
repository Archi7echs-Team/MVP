package com.dataviz.backend.service.impl;

import com.dataviz.backend.exception.InvalidCsvException;
import com.dataviz.backend.model.Coordinate;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class DefaultCsvFileReaderTest {

    private final DefaultCsvFileReader fileReader = new DefaultCsvFileReader();

    @Test
    @DisplayName("Test con CSV valido e più righe: si ottiene la lista corretta di coordinate")
    void testParseCsv_MultipleRows() throws InvalidCsvException {
        String csvData = "x,y,z\n" +
                "1.0,2.0,3.0\n" +
                "4.5,5.6,6.7\n" +
                "-7.8,9.0,10.11";
        MockMultipartFile file = new MockMultipartFile(
                "file", "test.csv", "text/csv", csvData.getBytes()
        );

        List<Coordinate> result = fileReader.parseCsv(file);

        assertNotNull(result);
        assertEquals(3, result.size(), "Dovrebbero esserci 3 coordinate");

        // Prima riga
        assertEquals(1.0, result.get(0).getX());
        assertEquals(2.0, result.get(0).getY());
        assertEquals(3.0, result.get(0).getZ());

        // Seconda riga
        assertEquals(4.5, result.get(1).getX());
        assertEquals(5.6, result.get(1).getY());
        assertEquals(6.7, result.get(1).getZ());

        // Terza riga
        assertEquals(-7.8, result.get(2).getX());
        assertEquals(9.0, result.get(2).getY());
        assertEquals(10.11, result.get(2).getZ());
    }

    @Test
    @DisplayName("Test con CSV valido ma singola riga di dati")
    void testParseCsv_SingleRow() throws InvalidCsvException {
        String csvData = "x,y,z\n" +
                "1.0,2.0,3.0";
        MockMultipartFile file = new MockMultipartFile(
                "file", "single.csv", "text/csv", csvData.getBytes()
        );

        List<Coordinate> result = fileReader.parseCsv(file);

        assertNotNull(result);
        assertEquals(1, result.size(), "Dovrebbe esserci 1 sola coordinata");

        Coordinate coord = result.getFirst();
        assertEquals(1.0, coord.getX());
        assertEquals(2.0, coord.getY());
        assertEquals(3.0, coord.getZ());
    }

    @Test
    @DisplayName("Test con CSV vuoto (solo header e nessun dato)")
    void testParseCsv_EmptyAfterHeader() throws InvalidCsvException {
        String csvData = "x,y,z\n"; // nessuna riga successiva
        MockMultipartFile file = new MockMultipartFile(
                "file", "empty.csv", "text/csv", csvData.getBytes()
        );

        List<Coordinate> result = fileReader.parseCsv(file);

        assertNotNull(result);
        assertTrue(result.isEmpty(), "La lista dovrebbe essere vuota");
    }

    @Test
    @DisplayName("Test con header mancante o non valido: lancia InvalidCsvException")
    void testParseCsv_MissingHeader() {
        // Manca la riga di header "x,y,z"
        String csvData = "1.0,2.0,3.0\n" +
                "4.0,5.0,6.0";
        MockMultipartFile file = new MockMultipartFile(
                "file", "noHeader.csv", "text/csv", csvData.getBytes()
        );

        assertThrows(InvalidCsvException.class, () -> fileReader.parseCsv(file),
                "Dovrebbe lanciare InvalidCsvException se l'header non è presente");
    }

    @Test
    @DisplayName("Test con valori non numerici: lancia InvalidCsvException")
    void testParseCsv_InvalidNumericValue() {
        String csvData = "x,y,z\n" +
                "1.0,2.0,invalid\n" +
                "4.0,5.0,6.0";
        MockMultipartFile file = new MockMultipartFile(
                "file", "invalidNumeric.csv", "text/csv", csvData.getBytes()
        );

        assertThrows(InvalidCsvException.class, () -> fileReader.parseCsv(file),
                "Dovrebbe lanciare InvalidCsvException per valori non numerici");
    }

    @Test
    @DisplayName("Test con valori numerici estremi (boundary test)")
    void testParseCsv_ExtremeValues() throws InvalidCsvException {
        // Verifichiamo come si comporta con numeri molto grandi o molto piccoli
        String csvData = "x,y,z\n" +
                "999999999999,0.0000000001,-999999999999";
        MockMultipartFile file = new MockMultipartFile(
                "file", "extreme.csv", "text/csv", csvData.getBytes()
        );

        List<Coordinate> result = fileReader.parseCsv(file);
        assertEquals(1, result.size());

        Coordinate c = result.getFirst();
        assertEquals(999999999999d, c.getX());
        assertEquals(1.0E-10, c.getY());  // 0.0000000001 in notazione scientifica
        assertEquals(-999999999999d, c.getZ());
    }

    @Test
    @DisplayName("Test con spazi bianchi intorno ai valori: devono essere gestiti correttamente")
    void testParseCsv_TrimSpaces() throws InvalidCsvException {
        // CSV con spazi extra
        String csvData = "x,y,z\n" +
                "   1.0 ,  2.0 , 3.0  \n" +
                "4.0 ,5.0,   6.0";
        MockMultipartFile file = new MockMultipartFile(
                "file", "trim.csv", "text/csv", csvData.getBytes()
        );

        List<Coordinate> result = fileReader.parseCsv(file);

        assertNotNull(result);
        assertEquals(2, result.size());

        // Prima riga
        Coordinate first = result.getFirst();
        assertEquals(1.0, first.getX());
        assertEquals(2.0, first.getY());
        assertEquals(3.0, first.getZ());

        // Seconda riga
        Coordinate second = result.get(1);
        assertEquals(4.0, second.getX());
        assertEquals(5.0, second.getY());
        assertEquals(6.0, second.getZ());
    }

    @Test
    @DisplayName("Test con colonne extra: x,y,z più altre (il parser potrebbe ignorarle o lanciare eccezione)")
    void testParseCsv_ExtraColumns() throws InvalidCsvException {
        // Qui ci sono 4 colonne: x,y,z, e 'extra'
        String csvData = "x,y,z,extra\n" +
                "1.0,2.0,3.0,qualcosa\n" +
                "4.0,5.0,6.0,qualcosaltro";
        MockMultipartFile file = new MockMultipartFile(
                "file", "extra.csv", "text/csv", csvData.getBytes()
        );


        List<Coordinate> result = fileReader.parseCsv(file);

        assertNotNull(result);
        assertEquals(2, result.size());

        // Verifichiamo che le prime 3 colonne siano parse correttamente
        assertEquals(1.0, result.getFirst().getX());
        assertEquals(2.0, result.getFirst().getY());
        assertEquals(3.0, result.getFirst().getZ());
    }

}
