package com.javalovers.core.item.domain.entity;

import com.javalovers.core.category.domain.entity.Category;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long itemId;

    @NotBlank
    private String description;

    @NotNull
    private Long stockQuantity;

    @Column(unique = true)
    private String tagCode;

    @ManyToOne(cascade = CascadeType.ALL)
    private Category category;
}
