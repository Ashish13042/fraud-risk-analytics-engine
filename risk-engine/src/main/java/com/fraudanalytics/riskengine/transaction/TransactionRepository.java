package com.fraudanalytics.riskengine.transaction;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, UUID> {
    // Spring Data JPA automatically provides methods like save(), findById(), etc.
    int countByUserIdAndCreatedAtAfter(String userId, LocalDateTime timestamp);
    List<Transaction> findByStatus(String status);
}