package com.example.drugtracker.service;

import java.util.List;

public class Teste {

    // Exemplo de código vulnerável a ser inserido
    public List<String> findByTitle(String userInput) {
        String query = "SELECT * FROM news WHERE title = '" + userInput + "'";
        return null;
    }
}
