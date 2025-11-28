package com.javalovers.core.item.domain.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "item")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id")
    private Long itemId;

    @NotBlank
    @Column(name = "description")
    private String description;

    @NotNull
    @Column(name = "stock_quantity")
    private Long stockQuantity;

    @Column(name = "tag_code", unique = true)
    private String tagCode;
}
