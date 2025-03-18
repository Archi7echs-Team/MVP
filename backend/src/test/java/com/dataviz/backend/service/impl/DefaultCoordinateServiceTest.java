package com.dataviz.backend.service.impl;

import com.dataviz.backend.controller.BackendApplication;
import com.dataviz.backend.model.CoordinateEntity;
import com.dataviz.backend.model.MatrixData;
import com.dataviz.backend.repository.CoordinateRepository;
import com.dataviz.backend.service.CoordinateService;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(classes = BackendApplication.class)
@ExtendWith(SpringExtension.class)
@Testcontainers
@DisplayName("Test di integrazione per DefaultCoordinateService - scenario SMALL, MEDIUM, LARGE + fallback")
class DefaultCoordinateServiceTest {

    @Autowired
    private CoordinateService coordinateService;

    @Autowired
    private CoordinateRepository coordinateRepository;

    @Container
    private static final PostgreSQLContainer<?> postgresContainer =
            new PostgreSQLContainer<>("postgres:17")
                    .withDatabaseName("testdb")
                    .withUsername("testuser")
                    .withPassword("testpass");

    @BeforeAll
    static void beforeAll() {
        postgresContainer.start();
    }

    @AfterAll
    static void afterAll() {
        postgresContainer.stop();
    }

    @DynamicPropertySource
    static void overrideProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgresContainer::getJdbcUrl);
        registry.add("spring.datasource.username", postgresContainer::getUsername);
        registry.add("spring.datasource.password", postgresContainer::getPassword);
    }

    @BeforeEach
    void setUp() {
        // Svuota il DB prima di ogni test
        coordinateRepository.deleteAll();

        // Inseriamo record di tipo SMALL
        coordinateRepository.save(new CoordinateEntity("X1", "Z1", 10.0, "SMALL"));
        coordinateRepository.save(new CoordinateEntity("X2", "Z2", 20.0, "SMALL"));

        // Inseriamo record di tipo MEDIUM
        coordinateRepository.save(new CoordinateEntity("X3", "Z3", 30.0, "MEDIUM"));
        coordinateRepository.save(new CoordinateEntity("X1", "Z4", 40.0, "MEDIUM"));

        // Inseriamo record di tipo LARGE
        coordinateRepository.save(new CoordinateEntity("X5", "Z5", 50.0, "LARGE"));
        coordinateRepository.save(new CoordinateEntity("X2", "Z6", 60.0, "LARGE"));
    }

    @Test
    @DisplayName("Se datasetType = SMALL, ritorna solo i record SMALL")
    void testGetCoordinatesSmallOnly() {
        MatrixData data = coordinateService.getCoordinates("SMALL");
        // Esempio: ci aspettiamo 2 record, quelli con datasetType = SMALL

        // Verifichiamo che X sia [X1, X2], Z sia [Z1, Z2], e dimensioni matrice coerenti
        List<String> xLabels = data.getxLabels();
        List<String> zLabels = data.getzLabels();
        double[][] yValues = data.getyValues();

        // Controlla la consistenza
        assertEquals(2, xLabels.size(), "Dovrebbero esserci 2 xLabels (X1, X2)");
        assertTrue(xLabels.contains("X1"), "X1 dovrebbe essere presente");
        assertTrue(xLabels.contains("X2"), "X2 dovrebbe essere presente");

        assertEquals(2, zLabels.size(), "Dovrebbero esserci 2 zLabels (Z1, Z2)");
        assertTrue(zLabels.contains("Z1"), "Z1 dovrebbe essere presente");
        assertTrue(zLabels.contains("Z2"), "Z2 dovrebbe essere presente");

        // Verifichiamo la matrice yValues (2 righe x 2 colonne) a seconda di come la costruisci
        assertEquals(2, yValues.length, "Righe di yValues dovrebbero essere 2");
        for (double[] row : yValues) {
            assertEquals(2, row.length, "Colonne di yValues dovrebbero essere 2");
        }

        // Se la logica è: yValues[r][c] corrisponde all'intersezione (zLabels[r], xLabels[c]),
        // possiamo verificare i valori previsti, p.es. 10.0 e 20.0, o 0.0 se mancanti
        // ...oppure, a seconda di come gestisci l'ordine, controlli di riflesso
    }

    @Test
    @DisplayName("Se datasetType = MEDIUM, ritorna i record SMALL + MEDIUM")
    void testGetCoordinatesMedium() {
        MatrixData data = coordinateService.getCoordinates("MEDIUM");

        // Adesso ci aspettiamo i record SMALL e MEDIUM
        // Nel setUp, abbiamo 2 SMALL e 2 MEDIUM, per un totale di 4 record

        List<String> xLabels = data.getxLabels();
        List<String> zLabels = data.getzLabels();
        double[][] yValues = data.getyValues();

        // Dovrebbero esserci X1, X2, X3, X1 (quello MEDIUM con X1),
        // in una collezione (potrebbero esserci duplicati se non gestiti).
        // Se la logica della tua implementazione rimuove duplicati, ci aspettiamo 3 xLabels: [X1, X2, X3].
        // E così via. Facciamo un esempio generico:

        // Esempio: controlliamo che contenga almeno X1, X2, X3
        assertTrue(xLabels.contains("X1"));
        assertTrue(xLabels.contains("X2"));
        assertTrue(xLabels.contains("X3"));

        // E zLabels potrebbe contenere Z1, Z2 (SMALL) e Z3, Z4 (MEDIUM)
        assertTrue(zLabels.contains("Z1"));
        assertTrue(zLabels.contains("Z2"));
        assertTrue(zLabels.contains("Z3"));
        assertTrue(zLabels.contains("Z4"));

        // Verifichiamo dimensioni della matrice in base a quanti X e Z unici hai.
        // Ad esempio, se hai 3 xLabels (X1, X2, X3) e 4 zLabels (Z1, Z2, Z3, Z4),
        // la matrice yValues avrà 4 righe e 3 colonne
        assertEquals(zLabels.size(), yValues.length);
        for (double[] row : yValues) {
            assertEquals(xLabels.size(), row.length);
        }

        // Eventuali controlli più specifici su valori, se necessario
    }

    @Test
    @DisplayName("Se datasetType = LARGE, ritorna i record SMALL + MEDIUM + LARGE")
    void testGetCoordinatesLarge() {
        MatrixData data = coordinateService.getCoordinates("LARGE");

        // Ci aspettiamo 2 (SMALL) + 2 (MEDIUM) + 2 (LARGE) = 6 record totali

        List<String> xLabels = data.getxLabels();
        List<String> zLabels = data.getzLabels();
        double[][] yValues = data.getyValues();

        // Dovrebbero comparire X1, X2, X3, X5 (e duplicati se ci sono).
        // Verifichiamo almeno che ci siano X1, X2, X3, X5
        assertTrue(xLabels.contains("X1"));
        assertTrue(xLabels.contains("X2"));
        assertTrue(xLabels.contains("X3"));
        assertTrue(xLabels.contains("X5"));

        // Per Z, ci aspettiamo Z1, Z2 (SMALL), Z3, Z4 (MEDIUM), Z5, Z6 (LARGE)
        assertTrue(zLabels.contains("Z1"));
        assertTrue(zLabels.contains("Z2"));
        assertTrue(zLabels.contains("Z3"));
        assertTrue(zLabels.contains("Z4"));
        assertTrue(zLabels.contains("Z5"));
        assertTrue(zLabels.contains("Z6"));

        // Controllo dimensioni
        assertEquals(zLabels.size(), yValues.length);
        for (double[] row : yValues) {
            assertEquals(xLabels.size(), row.length);
        }
    }

    @Test
    @DisplayName("DatasetType non valido => comportarsi come LARGE (SMALL + MEDIUM + LARGE)")
    void testGetCoordinatesInvalidDefaultsToLarge() {
        MatrixData data = coordinateService.getCoordinates("ABC_NON_VALIDO");

        // La logica prevede che, se non è SMALL/MEDIUM/LARGE, allora
        // si comporta come LARGE.
        // Quindi verifichiamo la stessa cosa del test su LARGE.

        // Ci aspettiamo quindi 6 record in totale.
        List<String> xLabels = data.getxLabels();
        List<String> zLabels = data.getzLabels();
        double[][] yValues = data.getyValues();

        // Stesse asserzioni di testGetCoordinatesLarge()
        assertTrue(xLabels.contains("X1"));
        assertTrue(xLabels.contains("X2"));
        assertTrue(xLabels.contains("X3"));
        assertTrue(xLabels.contains("X5"));

        assertTrue(zLabels.contains("Z1"));
        assertTrue(zLabels.contains("Z2"));
        assertTrue(zLabels.contains("Z3"));
        assertTrue(zLabels.contains("Z4"));
        assertTrue(zLabels.contains("Z5"));
        assertTrue(zLabels.contains("Z6"));

        assertEquals(zLabels.size(), yValues.length);
        for (double[] row : yValues) {
            assertEquals(xLabels.size(), row.length);
        }
    }

    @Test
    @DisplayName("Nessun record in DB => ritorna una matrice vuota")
    void testNoRecords() {
        // Svuotiamo il DB
        coordinateRepository.deleteAll();

        // Chiediamo SMALL, per esempio
        MatrixData data = coordinateService.getCoordinates("SMALL");
        assertTrue(data.getxLabels().isEmpty(), "xLabels deve essere vuoto");
        assertTrue(data.getzLabels().isEmpty(), "zLabels deve essere vuoto");
        assertEquals(0, data.getyValues().length, "yValues dovrebbe avere lunghezza 0");
    }
}
