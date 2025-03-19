package com.dataviz.backend.model.impl;

import com.dataviz.backend.model.MatrixData;

import java.util.List;

public record MatrixDataImpl(List<String> xLabels, List<String> zLabels, double[][] yValues) implements MatrixData {

}