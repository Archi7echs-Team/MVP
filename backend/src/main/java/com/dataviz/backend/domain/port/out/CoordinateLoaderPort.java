
package com.dataviz.backend.domain.port.out;

import com.dataviz.backend.model.CoordinateEntity;

import java.util.List;

public interface CoordinateLoaderPort {
    List<CoordinateEntity> loadCoordinatesByDatasetType(String datasetType);
}
