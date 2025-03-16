package com.dataviz.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "external.api")
public class ExternalAPIProperties {
    private String url;
    private int timeout;

    public int getTimeout() { return timeout; }
    public void setTimeout(int timeout) { this.timeout = timeout; }
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
}
