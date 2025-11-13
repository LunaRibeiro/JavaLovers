package com.javalovers.core.itemwithdrawn.repository;

import com.javalovers.core.itemwithdrawn.domain.entity.ItemWithdrawn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemWithdrawnRepository extends JpaRepository<ItemWithdrawn,Long> {
}
