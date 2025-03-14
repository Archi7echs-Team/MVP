package com.dataviz.backend.model;

import java.util.List;

public class MatrixData {
    private final List<String> xLabels;      // Label dell'asse X
    private final List<String> zLabels;      // Label dell'asse Z
    private final double[][] yValues;        // Matrice dei valori Y (dimensione: zLabels.size() x xLabels.size())

    public MatrixData(List<String> xLabels, List<String> zLabels, double[][] yValues) {
        this.xLabels = xLabels;
        this.zLabels = zLabels;
        this.yValues = yValues;
    }

    public List<String> getxLabels() {
        return xLabels;
    }

    public List<String> getzLabels() {
        return zLabels;
    }

    public double[][] getyValues() {
        return yValues;
    }
}
