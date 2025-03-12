package com.dataviz.backend.controller;

import com.dataviz.backend.service.CsvFileReader;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.mock.web.MockMultipartFile;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.hamcrest.Matchers.containsString;

@WebMvcTest(controllers = UploadController.class)
class UploadControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Mock
    private CsvFileReader csvFileReader;

    public UploadControllerTest() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void shouldReturnOkStatus() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "sample.csv", "text/csv", "data".getBytes());
        when(csvFileReader.parseCsv(any())).thenReturn(new Object());
        mockMvc.perform(multipart("/api/uploadCsv").file(file))
                .andExpect(status().isOk());
    }

    @Test
    void testUploadCsv_ValidFile() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "test.csv", "text/csv", "test data".getBytes());
        when(csvFileReader.parseCsv(any())).thenReturn(new Object());
        mockMvc.perform(multipart("/api/uploadCsv").file(file))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.content().string(containsString("File uploaded successfully.")));
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
                .andExpect(status().isBadRequest());
    }

    @Test
    void testUploadCsv_FileTooBig() throws Exception {
        byte[] largeContent = new byte[(int)(11L * 1024L * 1024L)];
        MockMultipartFile file = new MockMultipartFile("file", "large.csv", "text/csv", largeContent);
        mockMvc.perform(multipart("/api/uploadCsv").file(file))
                .andExpect(status().isPayloadTooLarge());
    }
}
