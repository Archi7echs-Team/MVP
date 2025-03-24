package com.dataviz.backend.exception;

public class APITimeoutException extends RuntimeException {
    public APITimeoutException(String message) {
        super(message);
    }
}
