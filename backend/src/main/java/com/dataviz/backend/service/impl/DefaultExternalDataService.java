package com.dataviz.backend.service.impl;

import com.dataviz.backend.config.ExternalAPIProperties;
import com.dataviz.backend.exception.APITimeoutException;
import com.dataviz.backend.exception.NetworkErrorException;
import com.dataviz.backend.model.MatrixData;
import com.dataviz.backend.service.ExternalDataService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.net.SocketTimeoutException;

@Service
public class DefaultExternalDataService implements ExternalDataService {
    private final RestTemplate restTemplate;
    private final ExternalAPIProperties properties;
    private final ObjectMapper objectMapper;

    public DefaultExternalDataService(RestTemplate restTemplate, ExternalAPIProperties properties, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.properties = properties;
        this.objectMapper = objectMapper;
    }

    // TODO: Sistema di logging per capire cosa è successo durante gli errori ad esempio ?
    // TODO: Deve restituire un MatrixData così che dal lato frontend si possa fare il parsing dei dati
    @Override
    public String fetchData() {
        try {
            ResponseEntity<String> response = restTemplate.getForEntity(properties.getUrl(), String.class);
            String responseBody = response.getBody();
            System.out.println(responseBody);
            validateData(responseBody);
            return response.getBody();
        } catch (ResourceAccessException ex) {
            if (ex.getCause() instanceof SocketTimeoutException) { // Controlla se l'eccezione è dovuta a un timeout
                throw new APITimeoutException("Request timed out after 5 seconds.");
            }
        } catch (HttpClientErrorException e) {
            // Handle degli errori lato client (4xx)
            System.err.println("Client error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
            throw new NetworkErrorException("Client error occurred while fetching data from external API.");
        } catch (HttpServerErrorException e) {
            // Handle degli errori lato server (5xx)
            System.err.println("Server error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
            throw new NetworkErrorException("Server error occurred while fetching data from external API.");
        } catch (Exception e) {
            // Handle di altri errori come quelli di network
            System.err.println("Error: " + e.getMessage());
            throw new NetworkErrorException("An error occurred while fetching data from external API.");
        }
        return "";
    }

    private void validateData(String data) throws Exception {
        JsonNode jsonNode = objectMapper.readTree(data);
        // TODO: inserire qui la logica di validazione dei dati e nel caso lanciare un'eccezione specifica
    }
}