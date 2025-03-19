package com.dataviz.backend.repository;

import com.dataviz.backend.model.CoordinateEntity;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository
public interface CoordinateRepository extends JpaRepository<CoordinateEntity, Long> {

    @Query("SELECT c FROM CoordinateEntity c WHERE c.datasetType >= :type")
    List<CoordinateEntity> findAllByDatasetType(@Param("type") String type);
}

