package com.dataviz.backend.exception;

public class TooMuchDataException extends RuntimeException {
    public TooMuchDataException(String message) {
        super(message);
    }
}
