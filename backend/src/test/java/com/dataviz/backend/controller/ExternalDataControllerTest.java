package com.dataviz.backend.controller;

import com.dataviz.backend.exception.GlobalExceptionHandler; // Importato per coerenza, anche se non strettamente usato qui
import com.dataviz.backend.model.impl.MatrixDataImpl;
import com.dataviz.backend.service.ExternalDataService;
import com.dataviz.backend.service.impl.DefaultExternalDataService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post; // Aggiunto per il test 405
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest // Usa il contesto completo dell'applicazione
@AutoConfigureMockMvc // Configura MockMvc
@Import({GlobalExceptionHandler.class}) // Importa l'handler per coerenza (opzionale qui)
@DisplayName("ExternalDataController - Test Stile CoordinateController")
class ExternalDataControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ExternalDataService externalDataService;

    @Test
    @DisplayName("GET /api/external/data - Chiamata standard")
    void testFetchExternalData_Success() throws Exception {
        // Verifica che la chiamata vada a buon fine (status 200 OK)
        // e che il tipo di contenuto sia JSON.
        // NON verifica il contenuto specifico, solo che la chiamata funzioni.
        when(externalDataService.fetchData()).thenReturn(new MatrixDataImpl(
                List.of("2025-03-18T00:00", "2025-03-18T01:00"),
                List.of(),
                List.of().toArray(new double[0][])
        ));
        mockMvc.perform(get("/api/external/data")
                        .accept(MediaType.APPLICATION_JSON)) // Specifica cosa accettare
                .andExpect(status().isOk()) // Verifica Status 200 OK
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON)); // Verifica Content Type (compatibile)
    }

    @Test
    @DisplayName("POST /api/external/data - Metodo non consentito")
    void testFetchExternalData_WrongMethod() throws Exception {
        // Verifica che usare un metodo HTTP non corretto (POST) risulti in 405

        mockMvc.perform(post("/api/external/data") // Usa il metodo POST
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isMethodNotAllowed()); // Verifica Status 405
    }
}