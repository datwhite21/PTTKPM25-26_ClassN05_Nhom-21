package com.nhom21.registration.config;

public class SystemConfig {

    private static volatile SystemConfig instance;

    private int maxCredits = 24;
    private long clickDelayMs = 500;

    private SystemConfig() {}

    public static SystemConfig getInstance() {
        if (instance == null) {
            synchronized (SystemConfig.class) {
                if (instance == null) {
                    instance = new SystemConfig();
                }
            }
        }
        return instance;
    }

    public int getMaxCredits() {
        return maxCredits;
    }

    public void setMaxCredits(int maxCredits) {
        this.maxCredits = maxCredits;
    }

    public long getClickDelayMs() {
        return clickDelayMs;
    }

    public void setClickDelayMs(long clickDelayMs) {
        this.clickDelayMs = clickDelayMs;
    }
}
