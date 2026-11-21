package com.bobbyvetcare.api.repository;

import com.bobbyvetcare.api.entity.ServiceEntity;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceRepository extends JpaRepository<ServiceEntity, String> {

    List<ServiceEntity> findAllByOrderByNameAsc();

    List<ServiceEntity> findByIdIn(Collection<String> ids);
}
