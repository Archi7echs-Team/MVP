package com.dataviz.backend.controller;

import com.dataviz.backend.exception.GlobalExceptionHandler;
import com.dataviz.backend.service.CsvFileReader;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UploadController.class)
@Import({UploadController.class, GlobalExceptionHandler.class})
class UploadControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CsvFileReader csvFileReader;

    @Test
    void shouldReturnOkStatus() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "sample.csv", "text/csv", "data".getBytes());
        when(csvFileReader.parseCsv(any())).thenReturn(new Object());

        mockMvc.perform(multipart("/api/uploadCsv").file(file))
                .andExpect(status().isOk())
                .andExpect(content().string("File uploaded successfully."));
    }

    @Test
    void testUploadCsv_ValidFile() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "test.csv", "text/csv", "test data".getBytes());
        when(csvFileReader.parseCsv(any())).thenReturn(new Object());

        mockMvc.perform(multipart("/api/uploadCsv").file(file))
                .andExpect(status().isOk())
                .andExpect(content().string("File uploaded successfully."));
    }

    @Test
    void testUploadCsv_EmptyFile() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "test.csv", "text/csv", new byte[0]);

        mockMvc.perform(multipart("/api/uploadCsv").file(file))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testUploadCsv_InvalidFileType() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "test.txt", "text/plain", "data".getBytes());

        mockMvc.perform(multipart("/api/uploadCsv").file(file))
                .andExpect(status().isBadRequest())
                .andExpect(MockMvcResultMatchers.content().string("Invalid file type. Only .csv is allowed."));
    }

    @Test
    void testUploadCsv_FileTooBig() throws Exception {
        byte[] largeContent = new byte[(int) (11L * 1024L * 1024L)];
        MockMultipartFile file = new MockMultipartFile("file", "large.csv", "text/csv", largeContent);

        mockMvc.perform(multipart("/api/uploadCsv").file(file))
                .andExpect(status().isPayloadTooLarge());
    }
}
