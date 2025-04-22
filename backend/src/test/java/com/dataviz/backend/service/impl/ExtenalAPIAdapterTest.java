package com.dataviz.backend.service.impl;

import com.dataviz.backend.adapter.out.external.ExternalAPIAdapter;
import com.dataviz.backend.config.ExternalAPIProperties;
import com.dataviz.backend.controller.BackendApplication;
import com.dataviz.backend.exception.APITimeoutException;
import com.dataviz.backend.exception.NetworkErrorException;
import com.dataviz.backend.model.MatrixData;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.*;

import java.net.SocketTimeoutException;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest(classes = BackendApplication.class)
@ExtendWith(MockitoExtension.class)
class ExternalAPIAdapterTest {

    @Mock
    private RestTemplate restTemplate;

    @Mock
    private ExternalAPIProperties properties;

    @InjectMocks
    private ExternalAPIAdapter externalAPIAdapter;

    private static final String MOCK_JSON_RESPONSE = """
        {
          "hourly": {
            "time": ["2025-03-18T00:00", "2025-03-18T01:00"],
            "temperature_2m": [5.2, 4.8],
            "humidity": [80, 82]
          }
        }
    """;

    @BeforeEach
    void setUp() {
        ObjectMapper objectMapper = new ObjectMapper();
        externalAPIAdapter = new ExternalAPIAdapter(restTemplate, properties, objectMapper);
    }

    @Test
    void testFetchData_success() {
        when(properties.getUrl()).thenReturn("http://mock-api.com");

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE, "application/json");

        ResponseEntity<String> mockResponse = new ResponseEntity<>(MOCK_JSON_RESPONSE, headers, HttpStatus.OK);
        when(properties.getMaxNumData()).thenReturn(1000);
        when(restTemplate.getForEntity(anyString(), eq(String.class)))
                .thenReturn(mockResponse);

        MatrixData result = externalAPIAdapter.fetchData();

        assertNotNull(result);
        assertEquals(List.of("2025-03-18T00:00", "2025-03-18T01:00"), result.xLabels());
        assertEquals(List.of("temperature_2m", "humidity"), result.zLabels());
        assertEquals(5.2, result.yValues()[0][0]);
        assertEquals(4.8, result.yValues()[0][1]);
        assertEquals(80, result.yValues()[1][0]);
        assertEquals(82, result.yValues()[1][1]);
    }

    @Test
    void testFetchData_clientError() {
        when(properties.getUrl()).thenReturn("http://mock-api.com");
        when(restTemplate.getForEntity(anyString(), eq(String.class)))
                .thenThrow(new HttpClientErrorException(HttpStatus.BAD_REQUEST));

        assertThrows(NetworkErrorException.class, () -> externalAPIAdapter.fetchData());
    }

    @Test
    void testFetchData_serverError() {
        when(properties.getUrl()).thenReturn("http://mock-api.com");
        when(restTemplate.getForEntity(anyString(), eq(String.class)))
                .thenThrow(new HttpServerErrorException(HttpStatus.INTERNAL_SERVER_ERROR));

        assertThrows(NetworkErrorException.class, () -> externalAPIAdapter.fetchData());
    }

    @Test
    void testFetchData_nonSocketTimeoutError() {
        when(properties.getUrl()).thenReturn("http://mock-api.com");
        ResourceAccessException resourceAccessException = new ResourceAccessException("Non-timeout error");
        when(restTemplate.getForEntity(anyString(), eq(String.class)))
                .thenThrow(resourceAccessException);

        NetworkErrorException exception = assertThrows(NetworkErrorException.class, () -> externalAPIAdapter.fetchData());
        assertEquals("An error occurred while fetching data from external API.", exception.getMessage());
    }

    @Test
    void testFetchData_timeoutError() {
        when(properties.getUrl()).thenReturn("http://mock-api.com");
        ResourceAccessException resourceAccessException = new ResourceAccessException("Timeout", new SocketTimeoutException());
        when(restTemplate.getForEntity(anyString(), eq(String.class)))
                .thenThrow(resourceAccessException);

        when(properties.getTimeout()).thenReturn(5000);
        APITimeoutException exception = assertThrows(APITimeoutException.class, () -> externalAPIAdapter.fetchData());
        assertEquals("Request timed out after 5000 milliseconds.", exception.getMessage());
    }

    @Test
    void testFetchData_unexpectedError() {
        when(properties.getUrl()).thenReturn("http://mock-api.com");
        when(restTemplate.getForEntity(anyString(), eq(String.class)))
                .thenThrow(new RuntimeException("Unexpected error"));

        assertThrows(NetworkErrorException.class, () -> externalAPIAdapter.fetchData());
    }

    @Test
    void testFetchData_unsupportedContentType() {
        when(properties.getUrl()).thenReturn("http://mock-api.com");

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE, "text/plain");

        ResponseEntity<String> mockResponse = new ResponseEntity<>("Unsupported content", headers, HttpStatus.OK);
        when(restTemplate.getForEntity(anyString(), eq(String.class))).thenReturn(mockResponse);

        assertThrows(NetworkErrorException.class, () -> externalAPIAdapter.fetchData());
    }

    @Test
    void testFetchData_non2xxResponse() {
        when(properties.getUrl()).thenReturn("http://mock-api.com");

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE, "application/json");

        ResponseEntity<String> mockResponse = new ResponseEntity<>("{}", headers, HttpStatus.NOT_MODIFIED);
        when(restTemplate.getForEntity(anyString(), eq(String.class))).thenReturn(mockResponse);

        MatrixData result = externalAPIAdapter.fetchData();

        assertNotNull(result);
        assertTrue(result.xLabels().isEmpty());
        assertTrue(result.zLabels().isEmpty());
        assertEquals(0, result.yValues().length);
    }
}
