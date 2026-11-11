package com.anoto.model;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import jakarta.persistence.OneToMany;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder 
public class Storage {

    @Id
    @GeneratedValue
    private Long id;

    private String fileName;

    @OneToMany(mappedBy = "profilePhoto")
    private List<User> user;

}
