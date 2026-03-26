package com.fraudanalytics.riskengine.risk;

import com.fraudanalytics.riskengine.transaction.Transaction;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class RiskScoringService {

    public int calculateRiskScore(Transaction transaction) {
        int score = 0;

        LocalDateTime fiveMinsAgo = LocalDateTime.now().minusMinutes(5);

        int recentAttempts = transactionRepository.countByUserIdAndCreatedAtAfter(
                transaction.getUserId(), fiveMinsAgo
        );

        // If they've tried 3 or more times in 5 minutes, massive risk spike
        if (recentAttempts >= 3) {
            score += 50;
        }

        if (transaction.getAmount().compareTo(new BigDecimal("1000")) > 0) {
            score += 30; // High value transactions are riskier
        }

        if ("CRYPTO".equalsIgnoreCase(transaction.getMerchantCategory()) ||
                "GAMBLING".equalsIgnoreCase(transaction.getMerchantCategory())) {
            score += 40;
        }

        if (transaction.getAmount().compareTo(new BigDecimal("10000")) > 0) {
            score = 100; // Immediate Flag
        }

        return Math.min(score, 100); // Cap score at 100
    }

    public String determineStatus(int score) {
        if (score >= 80) return "BLOCKED";
        if (score >= 50) return "FLAGGED";
        return "APPROVED";
    }
}