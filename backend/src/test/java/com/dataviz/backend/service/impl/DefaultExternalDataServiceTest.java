package com.dataviz.backend.service.impl;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withStatus;

import com.dataviz.backend.config.ExternalAPIProperties;
import com.dataviz.backend.controller.BackendApplication;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestTemplate;

@SpringBootTest(classes = BackendApplication.class)
class DefaultExternalDataServiceTest {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private DefaultExternalDataService service;

    @Autowired
    private ExternalAPIProperties properties;

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