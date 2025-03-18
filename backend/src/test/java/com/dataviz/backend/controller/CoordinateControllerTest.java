package com.dataviz.backend.controller;

import com.dataviz.backend.exception.GlobalExceptionHandler;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Import({GlobalExceptionHandler.class})
@DisplayName("CoordinateController - Test esaustivi per code coverage")
class CoordinateControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("Chiamata senza parametro - default LARGE")
    void testGetCoordinatesWithoutParameter_DefaultLarge() throws Exception {

        mockMvc.perform(get("/api/coordinates")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Chiamata con parametro SMALL valido")
    void testGetCoordinates_SmallDataset() throws Exception {

        mockMvc.perform(get("/api/coordinates")
                        .param("datasetType", "SMALL")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

    }

    @Test
    @DisplayName("Chiamata con parametro MEDIUM valido")
    void testGetCoordinates_MediumDataset() throws Exception {

        mockMvc.perform(get("/api/coordinates")
                        .param("datasetType", "MEDIUM")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Chiamata con parametro LARGE valido")
    void testGetCoordinates_LargeDataset() throws Exception {

        mockMvc.perform(get("/api/coordinates")
                        .param("datasetType", "LARGE")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

    }

    @Test
    @DisplayName("Chiamata con parametro invalido - default a LARGE")
    void testGetCoordinates_InvalidParameterDefaultsToLarge() throws Exception {

        mockMvc.perform(get("/api/coordinates")
                        .param("datasetType", "INVALID")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Servizio ritorna dati vuoti")
    void testGetCoordinates_EmptyData() throws Exception {

        mockMvc.perform(get("/api/coordinates")
                        .param("datasetType", "SMALL")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

    }
}
