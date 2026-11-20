package com.anoto.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.anoto.model.User;
import com.anoto.model.Folder;
import com.anoto.model.Note;
import com.anoto.dto.FolderRequest;
import com.anoto.dto.FolderResponse;
import com.anoto.mapper.FolderMapper;
import com.anoto.repository.FolderRepository;
import com.anoto.repository.NoteRepository;
import com.anoto.repository.UserRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FolderService {
        private static final Logger logger = LoggerFactory.getLogger(FolderService.class);

        private final FolderRepository folderRepository;
        private final NoteRepository noteRepository;
        private final UserRepository userRepository;
        private final FolderMapper folderMapper;

        private User getCurrentUser() {
                String email = SecurityContextHolder.getContext().getAuthentication().getName();
                return userRepository.findByEmail(email)
                                .orElseThrow(() -> {
                                        logger.error("Usuário não encontrado.");
                                        return new IllegalArgumentException("Usuário não encontrado.");
                                });
        }

        @Transactional
        public FolderResponse linkFolder(Long id, FolderRequest folderRequest) {
                User user = getCurrentUser();
                Folder folder = folderRepository.findById(id)
                                .orElseThrow(() -> {
                                        logger.error("Pasta não encontrada.");
                                        return new IllegalArgumentException("Pasta não encontrada.");
                                });

                if (!folder.getUser().getId().equals(user.getId())) {
                        logger.error("A pasta não pertence ao usuário autenticado.");
                        throw new IllegalArgumentException("Pasta não encontrada.");
                }

                Set<Long> existingIds = folder.getNotes().stream()
                                .map(Note::getId)
                                .collect(Collectors.toSet());
                List<Long> noteIds = folderRequest.noteIds() == null
                                ? List.of()
                                : folderRequest.noteIds().stream()
                                                .distinct()
                                                .filter(noteId -> !existingIds.contains(noteId))
                                                .toList();
                List<Note> newNotes = noteIds.stream()
                                .map(noteId -> noteRepository.findByIdAndUserId(noteId, user.getId())
                                                .orElseThrow(() -> {
                                                        logger.error("Nota não encontrada: " + noteId);
                                                        return new IllegalArgumentException(
                                                                        "Nota não encontrada: " + noteId);
                                                }))
                                .toList();

                newNotes.forEach(note -> {
                        note.getFolders().add(folder);
                        folder.getNotes().add(note);
                });
                noteRepository.saveAll(newNotes);

                logger.info("Pasta vinculada: " + folder.getId());

                return folderMapper.toResponse(folder);

        }

        @Transactional
        public FolderResponse updateFolder(Long id, FolderRequest folderRequest) {
                Folder folder = folderRepository.findById(id)
                                .orElseThrow(() -> {
                                        logger.error("Pasta não encontrada.");
                                        return new IllegalArgumentException("Pasta não encontrada.");
                                });

                folder.setTitle(folderRequest.title());

                folder.setDescription(folderRequest.description());

                if (folderRequest.noteIds() != null) {
                        Set<Long> requestedIds = folderRequest.noteIds().stream()
                                        .collect(Collectors.toSet());
                        List<Note> currentNotes = new ArrayList<>(folder.getNotes());

                        currentNotes.stream()
                                        .filter(note -> !requestedIds.contains(note.getId()))
                                        .forEach(note -> {
                                                note.getFolders().removeIf(
                                                                noteFolder -> noteFolder.getId()
                                                                                .equals(folder.getId()));
                                                folder.getNotes().remove(note);
                                        });

                        Set<Long> currentIds = folder.getNotes().stream()
                                        .map(Note::getId)
                                        .collect(Collectors.toSet());
                        List<Note> toAdd = requestedIds.stream()
                                        .filter(noteId -> !currentIds.contains(noteId))
                                        .map(noteId -> noteRepository.findById(noteId)
                                                        .orElseThrow(() -> new IllegalArgumentException(
                                                                        "Nota não encontrada: " + noteId)))
                                        .toList();

                        toAdd.forEach(note -> {
                                note.getFolders().add(folder);
                                folder.getNotes().add(note);
                        });
                }

                folder.setColor(folderRequest.color());

                folder.setUpdatedAt(LocalDateTime.now());

                folderRepository.save(folder);

                logger.info("Pasta atualizada: " + folder.getId());
                return folderMapper.toResponse(folder);
        }

        @Transactional
        public void deleteFolder(Long id) {
                Folder folder = folderRepository.findById(id)
                                .orElseThrow(() -> {
                                        logger.error("Pasta não encontrada.");
                                        return new IllegalArgumentException("Pasta não encontrada.");
                                });

                List<Note> notes = folder.getNotes();
                for (Note note : folder.getNotes()) {
                        note.getFolders().removeIf(
                                        noteFolder -> noteFolder.getId().equals(folder.getId()));
                }
                noteRepository.saveAll(notes);

                folderRepository.delete(folder);
                logger.info("Pasta deletada: " + folder.getId());
        }

        @Transactional(readOnly = true)
        public FolderResponse findById(Long id) {
                Folder folder = folderRepository.findById(id)
                                .orElseThrow(() -> {
                                        logger.error("Pasta não encontrada.");
                                        return new IllegalArgumentException("Pasta não encontrada.");
                                });

                logger.info("Pasta encontrada: " + folder.getId());
                return folderMapper.toResponse(folder);
        }

        @Transactional(readOnly = true)
        public List<FolderResponse> findAll() {

                User user = getCurrentUser();
                return folderRepository.findByUserIdOrderByIdAsc(user.getId())
                                .stream()
                                .map(folder -> folderMapper.toResponse(folder))
                                .toList();
        }

        @Transactional
        public FolderResponse createFolder(FolderRequest folderRequest) {

                User user = getCurrentUser();

                Folder folder = folderMapper.toEntity(folderRequest);
                folder.setUser(user);

                folderRepository.save(folder);

                List<Note> notes = folderRequest.noteIds() == null
                                ? List.of()
                                : folderRequest.noteIds().stream()
                                                .distinct()
                                                .map(noteId -> noteRepository.findByIdAndUserId(noteId, user.getId())
                                                                .orElseThrow(() -> {
                                                                        logger.error("Nota não encontrada: " + noteId);
                                                                        return new IllegalArgumentException(
                                                                                        "Nota não encontrada: "
                                                                                                        + noteId);
                                                                }))
                                                .toList();

                notes.forEach(note -> {
                        note.getFolders().add(folder);
                        folder.getNotes().add(note);
                });
                noteRepository.saveAll(notes);

                logger.info("Pasta criada com sucesso! " + folder.getId());

                return folderMapper.toResponse(folder);

        }

}
