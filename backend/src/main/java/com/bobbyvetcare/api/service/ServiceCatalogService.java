package com.bobbyvetcare.api.service;

import com.bobbyvetcare.api.dto.request.ServiceRequest;
import com.bobbyvetcare.api.dto.response.ServiceResponse;
import com.bobbyvetcare.api.entity.ServiceEntity;
import com.bobbyvetcare.api.exception.ResourceNotFoundException;
import com.bobbyvetcare.api.repository.ServiceRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class ServiceCatalogService {

    private final ServiceRepository serviceRepository;

    public ServiceCatalogService(ServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    public List<ServiceResponse> getAllServices() {
        return serviceRepository.findAllByOrderByNameAsc()
            .stream()
            .map(this::toResponse)
            .toList();
    }

    @Transactional
    public ServiceResponse createService(ServiceRequest request) {
        ServiceEntity service = new ServiceEntity();
        service.setName(request.name().trim());
        service.setCategory(request.category().trim());
        service.setPrice(request.price());
        service.setDescription(request.description() != null ? request.description().trim() : null);
        return toResponse(serviceRepository.save(service));
    }

    @Transactional
    public ServiceResponse updateService(String id, ServiceRequest request) {
        ServiceEntity service = serviceRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Servicio no encontrado: " + id));
        service.setName(request.name().trim());
        service.setCategory(request.category().trim());
        service.setPrice(request.price());
        service.setDescription(request.description() != null ? request.description().trim() : null);
        return toResponse(serviceRepository.save(service));
    }

    @Transactional
    public void deleteService(String id) {
        if (!serviceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Servicio no encontrado: " + id);
        }
        serviceRepository.deleteById(id);
    }

    public ServiceResponse toResponse(ServiceEntity entity) {
        return new ServiceResponse(
            entity.getId(),
            entity.getName(),
            entity.getCategory(),
            entity.getPrice(),
            entity.getDescription()
        );
    }
}
