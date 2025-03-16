package com.dataviz.backend.service.impl;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyString;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withStatus;

import static org.mockito.ArgumentMatchers.eq;
import com.dataviz.backend.config.ExternalAPIProperties;
import com.dataviz.backend.controller.BackendApplication;
import com.dataviz.backend.exception.APITimeoutException;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.net.SocketTimeoutException;

@SpringBootTest(classes = BackendApplication.class)
class DefaultExternalDataServiceTest {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private DefaultExternalDataService service;

    @Autowired
    private ExternalAPIProperties properties;

    // Test d'integrazione con un server reale
    @Test
    void testFetchData_RealAPI() {
        String result = service.fetchData();
        System.out.println(result);
        assertNotNull(result, "Response should not be null");
    }


    // Test con un server mockato
    @Test
    void testFetchData_Success() {
        MockRestServiceServer server = MockRestServiceServer.createServer(restTemplate);
        server.expect(requestTo(properties.getUrl()))
                .andRespond(withStatus(HttpStatus.OK)
                        .contentType(MediaType.APPLICATION_JSON).body("{\"result\":\"someValue\"}"));
        String result = service.fetchData();
        assertNotNull(result);
        server.verify();
    }

    @Test
    void testFetchData_Timeout() {
        // Ho dovuto usare un nuovo mock del RestTemplate perchè 'MockRestServiceServer' non simula i timeout dei socket "low-level"
        RestTemplate mockRestTemplate = Mockito.mock(RestTemplate.class);
        ReflectionTestUtils.setField(service, "restTemplate", mockRestTemplate);

        ResourceAccessException timeoutException = new ResourceAccessException(
                "Read timed out", new SocketTimeoutException("Read timed out"));

        Mockito.when(mockRestTemplate.getForEntity(anyString(), eq(String.class)))
                .thenThrow(timeoutException);

        assertThrows(APITimeoutException.class, () -> service.fetchData());
    }
    @Test
    void testFetchData_ClientError() {
        MockRestServiceServer server = MockRestServiceServer.createServer(restTemplate);

        server.expect(requestTo(properties.getUrl()))
                .andRespond(withStatus(HttpStatus.NOT_FOUND)
                        .contentType(MediaType.TEXT_PLAIN)
                        .body("Not Found"));

        assertThrows(RuntimeException.class, () -> service.fetchData());
        server.verify();
    }

    @Test
    void testFetchData_ServerError() {
        MockRestServiceServer server = MockRestServiceServer.createServer(restTemplate);

        server.expect(requestTo(properties.getUrl()))
                .andRespond(withStatus(HttpStatus.INTERNAL_SERVER_ERROR)
                        .contentType(MediaType.TEXT_PLAIN)
                        .body("Server Error"));

        assertThrows(RuntimeException.class, () -> service.fetchData());
        server.verify();
    }
}