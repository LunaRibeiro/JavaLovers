package com.javalovers.core.withdrawal.repository;

import com.javalovers.core.withdrawal.domain.entity.Withdrawal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WithdrawalRepository extends JpaRepository<Withdrawal, Long>{
}
