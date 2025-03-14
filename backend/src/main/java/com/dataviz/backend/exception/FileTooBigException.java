package com.dataviz.backend.exception;

public class FileTooBigException extends RuntimeException {
    public FileTooBigException(String message) {
        super(message);
    }
}
