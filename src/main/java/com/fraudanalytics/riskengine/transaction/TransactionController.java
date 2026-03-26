package com.fraudanalytics.riskengine.transaction;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    // POST endpoint to receive new transactions
    @PostMapping
    public ResponseEntity<Transaction> receiveTransaction(@RequestBody Transaction transaction) {
        Transaction savedTransaction = transactionService.processIncomingTransaction(transaction);
        return new ResponseEntity<>(savedTransaction, HttpStatus.CREATED);
    }
    @GetMapping
    public ResponseEntity<List<Transaction>> getTransactions(@RequestParam(required = false) String status) {
        List<Transaction> transactions;

        if (status != null && !status.isEmpty()) {
            transactions = transactionService.getTransactionsByStatus(status.toUpperCase());
        } else {
            transactions = transactionService.getAllTransactions();
        }

        return new ResponseEntity<>(transactions, HttpStatus.OK);
    }
}
