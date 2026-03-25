package com.fraudanalytics.riskengine;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/api/testing")
public class HomeController {

	@GetMapping
	public String test(){
		return "Backend is running";
	}

}
