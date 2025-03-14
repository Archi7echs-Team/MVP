package com.dataviz.backend.config;


import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "data")
public class DataProprieties {
    private int maxColsRows;
    private int maxNumData;
    private long maxFileSize;

    public int getMaxColsRows() {
        return maxColsRows;
    }

    public void setMaxColsRows(int maxColsRows) {
        this.maxColsRows = maxColsRows;
    }

    public int getMaxNumData() {
        return maxNumData;
    }

    public void setMaxNumData(int maxNumData) {
        this.maxNumData = maxNumData;
    }

    public int getMaxFileSize() {
        return maxNumData;
    }

    public void setMaxFileSize(long maxFileSize) {
        this.maxFileSize = maxFileSize;
    }
}
