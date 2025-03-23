package com.dataviz.backend.service.impl;

import com.dataviz.backend.config.ExternalAPIProperties;
import com.dataviz.backend.exception.APITimeoutException;
import com.dataviz.backend.exception.NetworkErrorException;
import com.dataviz.backend.model.MatrixData;
import com.dataviz.backend.model.impl.MatrixDataImpl;
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
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

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
    public MatrixData fetchData() {
        try {
            ResponseEntity<String> response = restTemplate.getForEntity(properties.getUrl(), String.class);
            HttpStatus statusCode = (HttpStatus) response.getStatusCode();
            MediaType contentType = response.getHeaders().getContentType();
            String responseBody = response.getBody();
            System.out.println(responseBody);
            if (statusCode.is2xxSuccessful()) {
                if (MediaType.APPLICATION_JSON.includes(contentType)) {
                    validateData(responseBody);
                    return parseData(responseBody);
                } else {
                    throw new NetworkErrorException("Unsupported content type: " + contentType);
                }
            }
        } catch (ResourceAccessException ex) {
            if (ex.getCause() instanceof SocketTimeoutException) {
                throw new APITimeoutException("Request timed out after " + properties.getTimeout() + " milliseconds.");
            }
            throw new NetworkErrorException("An error occurred while fetching data from external API.");
        } catch (HttpClientErrorException e) {
            throw new NetworkErrorException("Client error occurred while fetching data from external API.");
        } catch (HttpServerErrorException e) {
            throw new NetworkErrorException("Server error occurred while fetching data from external API.");
        } catch (Exception e) {
            throw new NetworkErrorException("An error occurred while fetching data from external API.");
        }
        return new MatrixDataImpl(new ArrayList<>(), new ArrayList<>(), new double[0][0]);
    }


    private MatrixData parseData(String jsonResponse) throws Exception {
        JsonNode root = objectMapper.readTree(jsonResponse);
        JsonNode hourly = root.path("hourly");

        List<String> xLabels = new ArrayList<>();
        hourly.path("time").forEach(node -> xLabels.add(node.asText()));

        List<String> zLabels = new ArrayList<>();
        Iterator<String> fieldNames = hourly.fieldNames();
        while (fieldNames.hasNext()) {
            String fieldName = fieldNames.next();
            if (!fieldName.equals("time")) {
                zLabels.add(fieldName);
            }
        }

        double[][] yValues = new double[zLabels.size()][xLabels.size()];
        for (int z = 0; z < zLabels.size(); z++) {
            String key = zLabels.get(z);
            JsonNode valuesArray = hourly.path(key);
            for (int x = 0; x < xLabels.size(); x++) {
                yValues[z][x] = valuesArray.get(x).asDouble();
            }
        }

        return new MatrixDataImpl(xLabels, zLabels, yValues);
    }

    // TODO: inserire qui la logica di validazione dei dati e nel caso lanciare un'eccezione specifica
    private void validateData(String data) throws Exception {
        JsonNode jsonNode = objectMapper.readTree(data);

    }
}