package com.example.drugtracker.scheduler;

import com.example.drugtracker.service.AlertService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class AlertScheduler {

    private final AlertService alertService;

    public AlertScheduler(AlertService alertService) {
        this.alertService = alertService;
    }

    @Scheduled(fixedRate = 5000) // Every 5 seconds
    public void scheduleAlerts() {
        alertService.generateAlerts();
    }
}
