package com.dataviz.backend.model;

import java.util.List;

public interface MatrixData {
    List<String> xLabels();
    List<String> zLabels();
    double[][] yValues();
}
