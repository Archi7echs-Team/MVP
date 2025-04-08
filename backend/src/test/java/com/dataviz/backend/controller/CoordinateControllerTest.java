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

// Import necessari
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print; // Per debug opzionale

@SpringBootTest
@AutoConfigureMockMvc
@Import({GlobalExceptionHandler.class})
@DisplayName("CoordinateController - Test esaustivi per code coverage")
class CoordinateControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("Chiamata senza parametro - default LARGE - Verifica contenuto")
    void testGetCoordinatesWithoutParameter_DefaultLarge() throws Exception {

        mockMvc.perform(get("/api/coordinates")
                        .accept(MediaType.APPLICATION_JSON))
                //  .andDo(print()) // Decommenta per vedere il JSON esatto
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").exists())
                // --- Usa i nomi corretti ---
                .andExpect(jsonPath("$.xLabels").exists())
                .andExpect(jsonPath("$.zLabels").exists())
                .andExpect(jsonPath("$.yValues").exists());
    }

    @Test
    @DisplayName("Chiamata con parametro SMALL valido - Verifica contenuto")
    void testGetCoordinates_SmallDataset() throws Exception {

        mockMvc.perform(get("/api/coordinates")
                        .param("datasetType", "SMALL")
                        .accept(MediaType.APPLICATION_JSON))
                //  .andDo(print()) // Decommenta per vedere il JSON esatto
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").exists())
                // --- Usa i nomi corretti ---
                .andExpect(jsonPath("$.xLabels").exists())
                .andExpect(jsonPath("$.zLabels").exists())
                .andExpect(jsonPath("$.yValues").exists());
    }

    @Test
    @DisplayName("Chiamata con parametro MEDIUM valido")
    void testGetCoordinates_MediumDataset() throws Exception {
        mockMvc.perform(get("/api/coordinates")
                        .param("datasetType", "MEDIUM")
                        .accept(MediaType.APPLICATION_JSON))
                //  .andDo(print()) // Decommenta per vedere il JSON esatto
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists())
                // --- Usa i nomi corretti ---
                .andExpect(jsonPath("$.xLabels").exists()); // Aggiunta minima (verifica anche gli altri se necessario)
    }

    @Test
    @DisplayName("Chiamata con parametro LARGE valido")
    void testGetCoordinates_LargeDataset() throws Exception {
        mockMvc.perform(get("/api/coordinates")
                        .param("datasetType", "LARGE")
                        .accept(MediaType.APPLICATION_JSON))
                //  .andDo(print()) // Decommenta per vedere il JSON esatto
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists())
                // --- Usa i nomi corretti ---
                .andExpect(jsonPath("$.xLabels").exists()); // Aggiunta minima
    }

    @Test
    @DisplayName("Chiamata con parametro invalido - default a LARGE - Verifica contenuto")
    void testGetCoordinates_InvalidParameterDefaultsToLarge() throws Exception {
        mockMvc.perform(get("/api/coordinates")
                        .param("datasetType", "INVALID")
                        .accept(MediaType.APPLICATION_JSON))
                //  .andDo(print()) // Decommenta per vedere il JSON esatto
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").exists())
                // --- Usa i nomi corretti ---
                .andExpect(jsonPath("$.xLabels").exists()) // Verifica esistenza come per default/LARGE
                .andExpect(jsonPath("$.zLabels").exists())
                .andExpect(jsonPath("$.yValues").exists());
    }

}