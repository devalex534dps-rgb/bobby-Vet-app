package com.bobbyvetcare.api.repository;

import com.bobbyvetcare.api.entity.RoleEntity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<RoleEntity, String> {

    Optional<RoleEntity> findByNameIgnoreCase(String name);
}
