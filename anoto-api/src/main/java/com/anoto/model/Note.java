package com.anoto.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.Set;
import java.util.HashSet;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "notes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String color;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @CreationTimestamp
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @Column(nullable = false)
    private Boolean fixed;


    @Builder.Default
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "note_folders", joinColumns = @JoinColumn(name = "note_id"), inverseJoinColumns = @JoinColumn(name = "folder_id"))
    private Set<Folder> folders = new HashSet<>();
}
