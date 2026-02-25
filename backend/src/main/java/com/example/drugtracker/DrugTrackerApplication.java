package com.example.drugtracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@org.springframework.scheduling.annotation.EnableScheduling
public class DrugTrackerApplication {
    public static void main(String[] args) {
        SpringApplication.run(DrugTrackerApplication.class, args);
    }
}
