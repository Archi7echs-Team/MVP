package com.dataviz.backend.service.impl;

import com.dataviz.backend.controller.BackendApplication;
import com.dataviz.backend.exception.InvalidCsvException;
import com.dataviz.backend.exception.TooMuchDataException;
import com.dataviz.backend.model.MatrixData;
import com.dataviz.backend.service.CsvFileReader;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = BackendApplication.class)
@ActiveProfiles("test")
@DisplayName("Test per DefaultCsvFileReader")
class DefaultCsvFileReaderTest {

    @Autowired
    private CsvFileReader fileReader;

    @Nested
    @DisplayName("Test di successo (CSV corretto)")
    class SuccessTests {

        @Test
        @DisplayName("CSV valido con più righe e colonne: estrazione corretta di X, Z e Y")
        void testParseCsv_SuccessMultipleRows() throws InvalidCsvException {
            System.out.println("Esecuzione testParseCsv_SuccessMultipleRows...");

            // Formato:
            //   A1 vuoto
            //   B1, C1, D1 ... => xLabels
            //   A2, A3, ... => zLabels
            //   Incrocio => yValues
            String csvData =
                    ",Vicenza,Padova,Venezia\n" +
                            "Mele,1.0,2.0,3.0\n" +
                            "Pere,3.0,2.0,1.0\n" +
                            "Banane,5.0,6.0,7.0";

            System.out.println("CSV Input:\n" + csvData);

            MockMultipartFile file = new MockMultipartFile(
                    "file", "test-multiple.csv", "text/csv", csvData.getBytes()
            );

            MatrixData matrix = fileReader.parseCsv(file);
            System.out.println("Parsing completato. Risultato ottenuto:");

            // Verifica xLabels
            List<String> xLabels = matrix.getxLabels();
            System.out.println("xLabels: " + xLabels);
            assertEquals(3, xLabels.size());
            assertEquals("Vicenza", xLabels.get(0));
            assertEquals("Padova", xLabels.get(1));
            assertEquals("Venezia", xLabels.get(2));

            // Verifica zLabels
            List<String> zLabels = matrix.getzLabels();
            System.out.println("zLabels: " + zLabels);
            assertEquals(3, zLabels.size());
            assertEquals("Mele", zLabels.get(0));
            assertEquals("Pere", zLabels.get(1));
            assertEquals("Banane", zLabels.get(2));

            // Verifica yValues
            double[][] yValues = matrix.getyValues();
            System.out.println("yValues:");
            for (int i = 0; i < yValues.length; i++) {
                System.out.print("[ ");
                for (int j = 0; j < yValues[i].length; j++) {
                    System.out.print(yValues[i][j] + " ");
                }
                System.out.println("]");
            }
            assertEquals(3, yValues.length);      // 3 righe
            assertEquals(3, yValues[0].length);     // 3 colonne

            // Riga 1 -> Mele
            assertEquals(1.0, yValues[0][0]);
            assertEquals(2.0, yValues[0][1]);
            assertEquals(3.0, yValues[0][2]);

            // Riga 2 -> Pere
            assertEquals(3.0, yValues[1][0]);
            assertEquals(2.0, yValues[1][1]);
            assertEquals(1.0, yValues[1][2]);

            // Riga 3 -> Banane
            assertEquals(5.0, yValues[2][0]);
            assertEquals(6.0, yValues[2][1]);
            assertEquals(7.0, yValues[2][2]);

            System.out.println("testParseCsv_SuccessMultipleRows completato.");
        }

        @Test
        @DisplayName("CSV valido ma una sola riga di dati (header + 1 data row)")
        void testParseCsv_SuccessSingleDataRow() throws InvalidCsvException {
            System.out.println("Esecuzione testParseCsv_SuccessSingleDataRow...");

            String csvData =
                    ",X1,X2\n" +
                            "LabelZ,1.23,4.56";

            System.out.println("CSV Input:\n" + csvData);

            MockMultipartFile file = new MockMultipartFile(
                    "file", "test-single.csv", "text/csv", csvData.getBytes()
            );

            MatrixData matrix = fileReader.parseCsv(file);
            System.out.println("Parsing completato. Risultato ottenuto:");

            // Verifica xLabels
            List<String> xLabels = matrix.getxLabels();
            System.out.println("xLabels: " + xLabels);
            assertEquals(2, xLabels.size());
            assertEquals("X1", xLabels.get(0));
            assertEquals("X2", xLabels.get(1));

            // Verifica zLabels
            List<String> zLabels = matrix.getzLabels();
            System.out.println("zLabels: " + zLabels);
            assertEquals(1, zLabels.size());
            assertEquals("LabelZ", zLabels.get(0));

            // Verifica yValues
            double[][] yValues = matrix.getyValues();
            System.out.println("yValues: ");
            for (int i = 0; i < yValues.length; i++) {
                System.out.print("[ ");
                for (int j = 0; j < yValues[i].length; j++) {
                    System.out.print(yValues[i][j] + " ");
                }
                System.out.println("]");
            }
            assertEquals(1, yValues.length);
            assertEquals(2, yValues[0].length);
            assertEquals(1.23, yValues[0][0]);
            assertEquals(4.56, yValues[0][1]);

            System.out.println("testParseCsv_SuccessSingleDataRow completato.");
        }

        @Test
        @DisplayName("CSV con valori numerici estremi (boundary test)")
        void testParseCsv_ExtremeValues() throws InvalidCsvException {
            System.out.println("Esecuzione testParseCsv_ExtremeValues...");

            String csvData =
                    ",X\n" +
                            "Z,999999999999";  // Numero molto grande

            System.out.println("CSV Input:\n" + csvData);

            MockMultipartFile file = new MockMultipartFile(
                    "file", "extreme.csv", "text/csv", csvData.getBytes()
            );

            MatrixData matrix = fileReader.parseCsv(file);
            System.out.println("Parsing completato. Risultato ottenuto:");

            List<String> xLabels = matrix.getxLabels();
            System.out.println("xLabels: " + xLabels);
            assertEquals(1, xLabels.size());
            assertEquals("X", xLabels.get(0));

            List<String> zLabels = matrix.getzLabels();
            System.out.println("zLabels: " + zLabels);
            assertEquals(1, zLabels.size());
            assertEquals("Z", zLabels.get(0));

            double[][] yValues = matrix.getyValues();
            System.out.println("yValues:");
            for (int i = 0; i < yValues.length; i++) {
                System.out.print("[ ");
                for (int j = 0; j < yValues[i].length; j++) {
                    System.out.print(yValues[i][j] + " ");
                }
                System.out.println("]");
            }
            assertEquals(1, yValues.length);
            assertEquals(1, yValues[0].length);
            assertEquals(999999999999d, yValues[0][0]);

            System.out.println("testParseCsv_ExtremeValues completato.");
        }

        @Test
        @DisplayName("CSV con spazi bianchi intorno ai valori (trim) - deve accettarli correttamente")
        void testParseCsv_TrimSpaces() throws InvalidCsvException {
            System.out.println("Esecuzione testParseCsv_TrimSpaces...");

            String csvData =
                    ",  X1  ,   X2\n" +
                            " Z1  ,  1.0  , 2.0  \n" +
                            "  Z2, 3.0,   4.0   ";

            System.out.println("CSV Input:\n" + csvData);

            MockMultipartFile file = new MockMultipartFile(
                    "file", "trim.csv", "text/csv", csvData.getBytes()
            );

            MatrixData matrix = fileReader.parseCsv(file);
            System.out.println("Parsing completato. Risultato ottenuto:");

            // Controllo xLabels
            List<String> xLabels = matrix.getxLabels();
            System.out.println("xLabels: " + xLabels);
            assertEquals(2, xLabels.size());
            assertEquals("X1", xLabels.get(0));
            assertEquals("X2", xLabels.get(1));

            // Controllo zLabels
            List<String> zLabels = matrix.getzLabels();
            System.out.println("zLabels: " + zLabels);
            assertEquals(2, zLabels.size());
            assertEquals("Z1", zLabels.get(0));
            assertEquals("Z2", zLabels.get(1));

            // Controllo yValues
            double[][] yValues = matrix.getyValues();
            System.out.println("yValues:");
            for (int i = 0; i < yValues.length; i++) {
                System.out.print("[ ");
                for (int j = 0; j < yValues[i].length; j++) {
                    System.out.print(yValues[i][j] + " ");
                }
                System.out.println("]");
            }
            assertEquals(2, yValues.length);
            assertEquals(2, yValues[0].length);
            assertEquals(1.0, yValues[0][0]);
            assertEquals(2.0, yValues[0][1]);
            assertEquals(3.0, yValues[1][0]);
            assertEquals(4.0, yValues[1][1]);

            System.out.println("testParseCsv_TrimSpaces completato.");
        }
    }

    @Nested
    @DisplayName("Test di fallimento (CSV non valido)")
    class FailureTests {

        @Test
        @DisplayName("CSV con meno di 2 righe totali (manca header o dati)")
        void testParseCsv_TooFewRows() {
            System.out.println("Esecuzione testParseCsv_TooFewRows...");

            String csvData = ",Header1,Header2";

            MockMultipartFile file = new MockMultipartFile(
                    "file", "too-few-rows.csv", "text/csv", csvData.getBytes()
            );

            InvalidCsvException ex = assertThrows(InvalidCsvException.class,
                    () -> fileReader.parseCsv(file));
            System.out.println("Eccezione lanciata: " + ex.getMessage());
            assertTrue(ex.getMessage().contains("almeno 2 righe"), "Deve indicare che il numero di righe non è valido");
            System.out.println("testParseCsv_TooFewRows completato.");
        }

        @Test
        @DisplayName("CSV con header con meno di 2 colonne")
        void testParseCsv_TooFewColumnsInHeader() {
            System.out.println("Esecuzione testParseCsv_TooFewColumnsInHeader...");

            String csvData = "HeaderX\n"+"Z1";

            MockMultipartFile file = new MockMultipartFile(
                    "file", "too-few-cols.csv", "text/csv", csvData.getBytes()
            );

            InvalidCsvException ex = assertThrows(InvalidCsvException.class,
                    () -> fileReader.parseCsv(file));
            System.out.println("Eccezione lanciata: " + ex.getMessage());
            assertTrue(ex.getMessage().contains("almeno 2 colonne"),"Deve indicare che il numero di colonne non è valido");
            System.out.println("testParseCsv_TooFewColumnsInHeader completato.");
        }

        @Test
        @DisplayName("CSV con mismatch del numero di colonne")
        void testParseCsv_MismatchColumnCount() {
            System.out.println("Esecuzione testParseCsv_MismatchColumnCount...");

            String csvData =
                    ",X1,X2\n" +
                            "Z1,1.0,2.0,EXTRA";

            MockMultipartFile file = new MockMultipartFile(
                    "file", "mismatch-cols.csv", "text/csv", csvData.getBytes()
            );

            InvalidCsvException ex = assertThrows(InvalidCsvException.class,
                    () -> fileReader.parseCsv(file));
            System.out.println("Eccezione lanciata: " + ex.getMessage());
            assertTrue(ex.getMessage().contains("Numero di colonne non valido"));
            System.out.println("testParseCsv_MismatchColumnCount completato.");
        }

        @Test
        @DisplayName("CSV con un campo vuoto")
        void testParseCsv_EmptyField() {
            System.out.println("Esecuzione testParseCsv_EmptyField...");

            String csvData =
                    ",X\n" +
                            "Z1,";

            MockMultipartFile file = new MockMultipartFile(
                    "file", "empty-field.csv", "text/csv", csvData.getBytes()
            );

            InvalidCsvException ex = assertThrows(InvalidCsvException.class,
                    () -> fileReader.parseCsv(file));
            System.out.println("Eccezione lanciata: " + ex.getMessage());
            assertTrue(ex.getMessage().contains("Campo vuoto"), "Deve indicare che il campo è vuoto");
            System.out.println("testParseCsv_EmptyField completato.");
        }

        @Test
        @DisplayName("CSV con valori non numerici dove attesi double")
        void testParseCsv_NonNumericValue() {
            System.out.println("Esecuzione testParseCsv_NonNumericValue...");

            String csvData =
                    ",X\n" +
                            "Z,notNumber";

            MockMultipartFile file = new MockMultipartFile(
                    "file", "non-numeric.csv", "text/csv", csvData.getBytes()
            );

            InvalidCsvException ex = assertThrows(InvalidCsvException.class,
                    () -> fileReader.parseCsv(file));
            System.out.println("Eccezione lanciata: " + ex.getMessage());
            assertTrue(ex.getMessage().contains("Valore non numerico"),
                    "Deve indicare che il valore non è numerico");
            System.out.println("testParseCsv_NonNumericValue completato.");
        }
    }

    @Test
    @DisplayName("")
    void testParseCsv_TooManyXLabels() {
        // Costruisce 302 colonne totali
        StringBuilder header = new StringBuilder(",");
        for (int i = 1; i <= 301; i++) {
            header.append("X").append(i).append(i < 301 ? "," : "");
        }
        StringBuilder row = new StringBuilder("Z1");
        for (int i = 1; i <= 301; i++) {
            row.append(",1.0");
        }
        String csvData = header + "\n" + row;

        MockMultipartFile file = new MockMultipartFile(
                "file", "too-many-x.csv", "text/csv", csvData.getBytes()
        );

        assertThrows(InvalidCsvException.class, () -> fileReader.parseCsv(file));
    }

    @Test
    @DisplayName("CSV con troppe righe (più di 300)")
    void testParseCsv_TooManyZLabels() {
        StringBuilder csvData = new StringBuilder(",X\n");
        // 301 righe Z
        for (int i = 1; i <= 301; i++) {
            csvData.append("Z").append(i).append(",1.0\n");
        }

        MockMultipartFile file = new MockMultipartFile(
                "file", "too-many-z.csv", "text/csv", csvData.toString().getBytes()
        );

        assertThrows(InvalidCsvException.class, () -> fileReader.parseCsv(file));
    }

    @Test
    @DisplayName("CSV con troppi dati (più di 1000)")
    void testParseCsv_TooManyTotalDataPoints() {
        StringBuilder header = new StringBuilder(",");
        for (int i = 1; i <= 20; i++) {
            header.append("X").append(i).append(i < 20 ? "," : "");
        }
        StringBuilder csvData = new StringBuilder(header).append("\n");
        for (int row = 1; row <= 51; row++) {
            csvData.append("Z").append(row);
            for (int col = 1; col <= 20; col++) {
                csvData.append(",1.0");
            }
            csvData.append("\n");
        }

        MockMultipartFile file = new MockMultipartFile(
                "file", "too-many-points.csv", "text/csv", csvData.toString().getBytes()
        );

        assertThrows(TooMuchDataException.class, () -> fileReader.parseCsv(file));
    }
}