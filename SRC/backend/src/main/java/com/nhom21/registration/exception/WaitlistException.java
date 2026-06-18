package com.nhom21.registration.exception;

public class WaitlistException extends RuntimeException {
    private final int position;

    public WaitlistException(String message, int position) {
        super(message);
        this.position = position;
    }

    public int getPosition() {
        return position;
    }
}
