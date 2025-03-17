package com.dataviz.backend.service;

import com.dataviz.backend.model.MatrixData;

public interface CoordinateService {
    MatrixData getCoordinates(String datasetType);
}
