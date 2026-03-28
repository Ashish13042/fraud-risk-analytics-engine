package com.fraudanalytics.riskengine.transaction;

import com.fraudanalytics.riskengine.risk.RiskScoringService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final RiskScoringService riskScoringService;
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    public List<Transaction> getTransactionsByStatus(String status) {
        return transactionRepository.findByStatus(status);
    }

    public Transaction processIncomingTransaction(Transaction transaction) {
        int score = riskScoringService.calculateRiskScore(transaction);
        String status = riskScoringService.determineStatus(score);

        transaction.setRiskScore(score);
        transaction.setStatus(status);

        return transactionRepository.save(transaction);
    }
}
