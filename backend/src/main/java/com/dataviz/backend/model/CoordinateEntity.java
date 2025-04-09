package com.dataviz.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "coordinates")
public class CoordinateEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "x_label")
    private String xLabel;

    @Column(name = "z_label")
    private String zLabel;

    @Column(name = "y_value")
    private Double yValue;

    @Column(name = "dataset_type")
    private String datasetType;

    public CoordinateEntity() {
    }

    public CoordinateEntity(String xLabel, String zLabel, Double yValue, String datasetType) {
        this.xLabel = xLabel;
        this.zLabel = zLabel;
        this.yValue = yValue;
        this.datasetType = datasetType;
    }

    public String getXLabel() {
        return xLabel;
    }


    public String getZLabel() {
        return zLabel;
    }


    public Double getYValue() {
        return yValue;
    }
}
