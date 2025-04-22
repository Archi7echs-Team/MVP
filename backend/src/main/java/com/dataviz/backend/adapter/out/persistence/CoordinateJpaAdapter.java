package com.dataviz.backend.adapter.out.persistence;

import com.dataviz.backend.domain.port.out.CoordinateLoaderPort;
import com.dataviz.backend.model.CoordinateEntity;
import com.dataviz.backend.repository.CoordinateRepository;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CoordinateJpaAdapter implements CoordinateLoaderPort {

    private final CoordinateRepository coordinateRepository;

    public CoordinateJpaAdapter(CoordinateRepository coordinateRepository) {
        this.coordinateRepository = coordinateRepository;
    }

    @Override
    public List<CoordinateEntity> loadCoordinatesByDatasetType(String datasetType) {
        return coordinateRepository.findAllByDatasetType(datasetType);
    }
}
