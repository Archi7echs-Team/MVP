package com.dataviz.backend.adapter.out.external;

import com.dataviz.backend.config.ExternalAPIProperties;
import com.dataviz.backend.domain.port.out.ExternalDataPort;
import com.dataviz.backend.exception.APITimeoutException;
import com.dataviz.backend.exception.NetworkErrorException;
import com.dataviz.backend.exception.TooMuchDataException;
import com.dataviz.backend.model.MatrixData;
import com.dataviz.backend.model.impl.MatrixDataImpl;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.*;

import java.net.SocketTimeoutException;
import java.util.*;

@Component
public class ExternalAPIAdapter implements ExternalDataPort {

    private final RestTemplate restTemplate;
    private final ExternalAPIProperties properties;
    private final ObjectMapper objectMapper;

    public ExternalAPIAdapter(RestTemplate restTemplate, ExternalAPIProperties properties, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.properties = properties;
        this.objectMapper = objectMapper;
    }

    @Override
    public MatrixData fetchData() {
        try {
            ResponseEntity<String> response = restTemplate.getForEntity(properties.getUrl(), String.class);
            HttpStatus statusCode = (HttpStatus) response.getStatusCode();
            MediaType contentType = response.getHeaders().getContentType();
            String responseBody = response.getBody();
            if (statusCode.is2xxSuccessful()) {
                if (MediaType.APPLICATION_JSON.includes(contentType)) {
                    MatrixData parsedData = parseData(responseBody);
                    validateData(parsedData);
                    return parsedData;
                } else {
                    throw new NetworkErrorException("Unsupported content type: " + contentType);
                }
            }
        } catch (ResourceAccessException ex) {
            if (ex.getCause() instanceof SocketTimeoutException) {
                throw new APITimeoutException("Request timed out after " + properties.getTimeout() + " milliseconds.");
            }
            throw new NetworkErrorException("An error occurred while fetching data from external API.");
        } catch (HttpClientErrorException | HttpServerErrorException e) {
            throw new NetworkErrorException("HTTP error while fetching data: " + e.getMessage());
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

    private void validateData(MatrixData data) throws TooMuchDataException {
        if (data.yValues().length * data.yValues()[0].length > properties.getMaxNumData()) {
            throw new TooMuchDataException("API response contains too much data.");
        }
    }
}
