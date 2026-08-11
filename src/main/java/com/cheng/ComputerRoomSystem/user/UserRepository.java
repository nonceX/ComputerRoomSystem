package com.cheng.ComputerRoomSystem.user;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);

    boolean existsByEmployeeNo(String employeeNo);

    @Query("""
            SELECT u FROM User u
            WHERE (:realName IS NULL OR u.realName LIKE %:realName%)
              AND (:department IS NULL OR u.department = :department)
              AND (:roleCode IS NULL OR u.roleCode = :roleCode)
            ORDER BY u.id ASC
            """)
    Page<User> search(@Param("realName") String realName,
                      @Param("department") String department,
                      @Param("roleCode") String roleCode,
                      Pageable pageable);
}