package com.dataviz.backend.domain.port.out;

import com.dataviz.backend.model.MatrixData;

public interface ExternalDataPort {
    MatrixData fetchData();
}
