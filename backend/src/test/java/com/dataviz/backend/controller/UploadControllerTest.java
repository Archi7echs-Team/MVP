package com.dataviz.backend.controller;

import com.dataviz.backend.exception.GlobalExceptionHandler;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UploadController.class)
@Import({UploadController.class, GlobalExceptionHandler.class})
@ActiveProfiles("test")
class UploadControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("Test all'endpoint /api/uploadCsv con un file CSV valido")
    void testUploadCsv_Ok() throws Exception {
        String csvData = ",X1,X2\n" + "LabelZ,1.23,4.56";
        MockMultipartFile file = new MockMultipartFile("file", "sample.csv", "text/csv", csvData.getBytes());
        mockMvc.perform(multipart("/api/uploadCsv").file(file))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Test all'endpoint /api/uploadCsv con un file CSV non valido")
    void testUploadCsv_NotOk() throws Exception {
        String csvData = ",X1\n" + "LabelZ,1.23,4.56";
        MockMultipartFile file = new MockMultipartFile("file", "sample.csv", "text/csv", csvData.getBytes());
        mockMvc.perform(multipart("/api/uploadCsv").file(file))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Test all'endpoint /api/uploadCsv con un file CSV vuoto")
    void testUploadCsv_EmptyFile() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "test.csv", "text/csv", new byte[0]);

        mockMvc.perform(multipart("/api/uploadCsv").file(file))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Test all'endpoint /api/uploadCsv con un file non CSV")
    void testUploadCsv_InvalidFileType() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "test.txt", "text/plain", "data".getBytes());

        mockMvc.perform(multipart("/api/uploadCsv").file(file))
                .andExpect(status().isBadRequest())
                .andExpect(MockMvcResultMatchers.content().string("Invalid file type. Only .csv is allowed."));
    }

    @Test
    @DisplayName("Test all'endpoint /api/uploadCsv con un file CSV troppo grande")
    void testUploadCsv_FileTooBig() throws Exception {
        byte[] largeContent = new byte[(int) (11L * 1024L * 1024L)];
        MockMultipartFile file = new MockMultipartFile("file", "large.csv", "text/csv", largeContent);

        mockMvc.perform(multipart("/api/uploadCsv").file(file))
                .andExpect(status().isPayloadTooLarge());
    }
}