package com.bobbyvetcare.api.controller;

import com.bobbyvetcare.api.dto.response.FolioLookupResponse;
import com.bobbyvetcare.api.service.PublicPortalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/public")
public class PublicPortalController {

    private final PublicPortalService publicPortalService;

    public PublicPortalController(PublicPortalService publicPortalService) {
        this.publicPortalService = publicPortalService;
    }

    @GetMapping("/folio/{folio}")
    public ResponseEntity<FolioLookupResponse> lookupByFolio(@PathVariable String folio) {
        return ResponseEntity.ok(publicPortalService.lookupByFolio(folio));
    }
}
