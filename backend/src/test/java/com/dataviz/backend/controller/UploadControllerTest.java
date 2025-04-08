package com.dataviz.backend.controller;

import com.dataviz.backend.exception.GlobalExceptionHandler;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

// Import necessari
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print; // Per debug opzionale


@SpringBootTest
@AutoConfigureMockMvc
@Import({GlobalExceptionHandler.class})
class UploadControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("Test all'endpoint /api/uploadCsv con un file CSV valido - Verifica contenuto")
    void testUploadCsv_Ok() throws Exception {
        // Arrange: Dati CSV validi
        // La prima colonna vuota suggerisce che "LabelZ" sia una label di riga (zLabel?)
        // e "X1", "X2" siano header di colonna (xLabels?)
        String csvData = ",X1,X2\n" +
                "LabelZ,1.23,4.56";
        MockMultipartFile file = new MockMultipartFile("file", "sample.csv", "text/csv", csvData.getBytes());

        // Act & Assert
        mockMvc.perform(multipart("/api/uploadCsv").file(file)
                        .accept(MediaType.APPLICATION_JSON))
                //  .andDo(print()) // Decommenta per vedere il JSON esatto
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").exists())
                // --- Usa i nomi corretti e mappa CSV -> MatrixData (ipotesi) ---

                // Assumiamo che le colonne del CSV (X1, X2) diventino xLabels
                .andExpect(jsonPath("$.xLabels").exists())
                .andExpect(jsonPath("$.xLabels", hasSize(2)))
                .andExpect(jsonPath("$.xLabels[0]", is("X1")))
                .andExpect(jsonPath("$.xLabels[1]", is("X2")))

                // Assumiamo che la prima colonna del CSV (LabelZ) diventi zLabels
                .andExpect(jsonPath("$.zLabels").exists())
                .andExpect(jsonPath("$.zLabels", hasSize(1)))
                .andExpect(jsonPath("$.zLabels[0]", is("LabelZ")))

                // Assumiamo che i valori numerici diventino yValues
                .andExpect(jsonPath("$.yValues").exists())
                .andExpect(jsonPath("$.yValues", hasSize(1))) // Una riga di dati
                .andExpect(jsonPath("$.yValues[0]", hasSize(2))) // Due valori per riga
                .andExpect(jsonPath("$.yValues[0][0]", is(1.23)))
                .andExpect(jsonPath("$.yValues[0][1]", is(4.56)));
    }

    // --- Gli altri test rimangono invariati perché testano errori ---
    // (testUploadCsv_NotOk, _EmptyFile, _InvalidFileType, _FileTooBig)
    // ... (copia gli altri metodi di test da UploadControllerTest precedente) ...

    @Test
    @DisplayName("Test all'endpoint /api/uploadCsv con un file CSV non valido")
    void testUploadCsv_NotOk() throws Exception {
        // Arrange: Dati CSV non validi (es. numero colonne incoerente)
        String csvData = ",X1\n" + // Solo una colonna nell'header
                "LabelZ,1.23,4.56"; // Ma due valori nei dati
        MockMultipartFile file = new MockMultipartFile("file", "sample.csv", "text/csv", csvData.getBytes());

        // Act & Assert: Ci si aspetta un errore dal parser
        mockMvc.perform(multipart("/api/uploadCsv").file(file))
                .andExpect(status().isBadRequest()); // Verifica Status 400 Bad Request
    }

    @Test
    @DisplayName("Test all'endpoint /api/uploadCsv con un file CSV vuoto")
    void testUploadCsv_EmptyFile() throws Exception {
        // Arrange: File vuoto
        MockMultipartFile file = new MockMultipartFile("file", "test.csv", "text/csv", new byte[0]);

        // Act & Assert: Ci si aspetta un errore (file vuoto non valido)
        mockMvc.perform(multipart("/api/uploadCsv").file(file))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Test all'endpoint /api/uploadCsv con un file non CSV")
    void testUploadCsv_InvalidFileType() throws Exception {
        // Arrange: File non CSV
        MockMultipartFile file = new MockMultipartFile("file", "test.txt", "text/plain", "data".getBytes());

        // Act & Assert: Ci si aspetta errore per tipo file non valido
        mockMvc.perform(multipart("/api/uploadCsv").file(file))
                .andExpect(status().isBadRequest())
                // Verifica messaggio di errore specifico (come già presente)
                .andExpect(MockMvcResultMatchers.content().string("Invalid file type. Only .csv is allowed."));
    }

    @Test
    @DisplayName("Test all'endpoint /api/uploadCsv con un file CSV troppo grande")
    void testUploadCsv_FileTooBig() throws Exception {
        // Arrange: File di dimensioni superiori al limite (ipotetico < 11MB)
        byte[] largeContent = new byte[(int) (11L * 1024L * 1024L)]; // 11 MB
        MockMultipartFile file = new MockMultipartFile("file", "large.csv", "text/csv", largeContent);

        // Act & Assert: Ci si aspetta errore per payload troppo grande
        mockMvc.perform(multipart("/api/uploadCsv").file(file))
                .andExpect(status().isPayloadTooLarge()); // Verifica Status 413
    }

}