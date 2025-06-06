package com.dataviz.backend.service.impl;

import com.dataviz.backend.domain.port.out.CoordinateLoaderPort;
import com.dataviz.backend.model.CoordinateEntity;
import com.dataviz.backend.model.MatrixData;
import com.dataviz.backend.model.impl.MatrixDataImpl;
import com.dataviz.backend.service.CoordinateService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Service
public class DefaultCoordinateService implements CoordinateService {


    private final CoordinateLoaderPort coordinateLoaderPort;

    public DefaultCoordinateService(CoordinateLoaderPort coordinateLoaderPort) {
        this.coordinateLoaderPort = coordinateLoaderPort;
    }

    @Transactional(readOnly = true)
    @Override
    public MatrixData getCoordinates(String datasetType) {
        // Carica dal DB, ad esempio filtrando per datasetType
        List<CoordinateEntity> rows = coordinateLoaderPort.loadCoordinatesByDatasetType(datasetType);

        // Estrazione delle etichette x e z
        Set<String> xLabelSet = new LinkedHashSet<>();
        Set<String> zLabelSet = new LinkedHashSet<>();

        for (CoordinateEntity row : rows) {
            xLabelSet.add(row.getXLabel());
            zLabelSet.add(row.getZLabel());
        }

        List<String> xLabels = new ArrayList<>(xLabelSet);
        List<String> zLabels = new ArrayList<>(zLabelSet);

        // Creazione della matrice yValues
        double[][] yValues = new double[zLabels.size()][xLabels.size()];

        // Riempimento della matrice
        for (CoordinateEntity row : rows) {
            int zIndex = zLabels.indexOf(row.getZLabel());
            int xIndex = xLabels.indexOf(row.getXLabel());
            yValues[zIndex][xIndex] = row.getYValue();
        }
        return new MatrixDataImpl(xLabels, zLabels, yValues);
    }
}
