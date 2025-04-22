package com.dataviz.backend.service.impl;

import com.dataviz.backend.domain.port.out.ExternalDataPort;
import com.dataviz.backend.model.MatrixData;
import com.dataviz.backend.service.ExternalDataService;
import org.springframework.stereotype.Service;

@Service
public class DefaultExternalDataService implements ExternalDataService {

    private final ExternalDataPort externalDataPort;

    public DefaultExternalDataService(ExternalDataPort externalDataPort) {
        this.externalDataPort = externalDataPort;
    }

    @Override
    public MatrixData fetchData() {
        return externalDataPort.fetchData();
    }
}
