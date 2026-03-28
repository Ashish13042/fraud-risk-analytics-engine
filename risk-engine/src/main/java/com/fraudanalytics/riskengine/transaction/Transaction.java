package com.fraudanalytics.riskengine.transaction;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "transactions")
@Data // This Lombok annotation automatically creates Getters and Setters for you
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String userId;
    private BigDecimal amount;
    private String currency;
    private String merchantCategory;
    private String locationCountry;
    private String deviceId;

    private int riskScore;
    private String status; // e.g., APPROVED, FLAGGED, BLOCKED

    private LocalDateTime createdAt = LocalDateTime.now();
}