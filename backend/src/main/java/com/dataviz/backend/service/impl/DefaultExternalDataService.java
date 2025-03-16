package com.dataviz.backend.service.impl;

import com.dataviz.backend.config.ExternalAPIProperties;
import com.dataviz.backend.exception.APITimeoutException;
import com.dataviz.backend.exception.NetworkErrorException;
import com.dataviz.backend.model.MatrixData;
import com.dataviz.backend.service.ExternalDataService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
            HttpStatus statusCode = (HttpStatus) response.getStatusCode();
            MediaType contentType = response.getHeaders().getContentType();
            String responseBody = response.getBody();
            System.out.println(responseBody);
            if (statusCode.is2xxSuccessful()) {
                if (MediaType.APPLICATION_JSON.includes(contentType)) {
                    validateData(responseBody);
                    // TODO: Creare un sistema che prenda il JSON e lo porti in formato Matrix Data
                    return responseBody;
                } else {
                    throw new NetworkErrorException("Unsupported content type: " + contentType);
                }
            } else if (statusCode.is4xxClientError()) {
                throw new NetworkErrorException("Client error: " + statusCode + " - " + responseBody);
            } else if (statusCode.is5xxServerError()) {
                throw new NetworkErrorException("Server error: " + statusCode + " - " + responseBody);
            }
        } catch (ResourceAccessException ex) {
            if (ex.getCause() instanceof SocketTimeoutException) {
                throw new APITimeoutException("Request timed out after " + properties.getTimeout() + " milliseconds.");
            }
        } catch (HttpClientErrorException e) {
            throw new NetworkErrorException("Client error occurred while fetching data from external API.");
        } catch (HttpServerErrorException e) {
            throw new NetworkErrorException("Server error occurred while fetching data from external API.");
        } catch (Exception e) {
            throw new NetworkErrorException("An error occurred while fetching data from external API.");
        }
        return "";
    }
    // TODO: inserire qui la logica di validazione dei dati e nel caso lanciare un'eccezione specifica
    private void validateData(String data) throws Exception {
        JsonNode jsonNode = objectMapper.readTree(data);

    }
}