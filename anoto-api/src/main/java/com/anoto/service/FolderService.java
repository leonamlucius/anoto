package com.anoto.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.anoto.model.User;
import com.anoto.model.Folder;
import com.anoto.model.Note;
import com.anoto.dto.FolderRequest;
import com.anoto.dto.FolderResponse;
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
                List<Long> noteIds = folderRequest.getNoteIds() == null
                                ? List.of()
                                : folderRequest.getNoteIds().stream()
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

                newNotes.forEach(note -> note.setFolder(folder));
                noteRepository.saveAll(newNotes);
                folder.getNotes().addAll(newNotes);

                logger.info("Pasta vinculada: " + folder.getId());
                return new FolderResponse(folder.getId(), folder.getTitle(), folder.getDescription(),
                                folder.getCreatedAt(),
                                folder.getUpdatedAt(), folder.getNotes().stream().map(note -> note.getId()).toList(),
                                folder.getColor());
        }

        @Transactional
        public FolderResponse updateFolder(Long id, FolderRequest folderRequest) {
                Folder folder = folderRepository.findById(id)
                                .orElseThrow(() -> {
                                        logger.error("Pasta não encontrada.");
                                        return new IllegalArgumentException("Pasta não encontrada.");
                                });

                if (folderRequest.getTitle() != null) {
                        folder.setTitle(folderRequest.getTitle());
                }
                if (folderRequest.getDescription() != null) {
                        folder.setDescription(folderRequest.getDescription());
                }

                if (folderRequest.getNoteIds() != null) {
                        Set<Long> existingIds = folder.getNotes().stream()
                                        .map(Note::getId)
                                        .collect(Collectors.toSet());

                        List<Note> toAdd = folderRequest.getNoteIds().stream()
                                        .filter(noteId -> !existingIds.contains(noteId))
                                        .map(noteId -> noteRepository.findById(noteId)
                                                        .orElseThrow(() -> new IllegalArgumentException(
                                                                        "Nota não encontrada: " + noteId)))
                                        .toList();

                        toAdd.forEach(note -> note.setFolder(folder));
                        noteRepository.saveAll(toAdd);
                        folder.getNotes().addAll(toAdd);
                }

                if (folderRequest.getColor() != null) {
                        folder.setColor(folderRequest.getColor());
                }
                folderRepository.save(folder);

                logger.info("Pasta atualizada: " + folder.getId());
                return new FolderResponse(folder.getId(), folder.getTitle(), folder.getDescription(),
                                folder.getCreatedAt(),
                                folder.getUpdatedAt(), folder.getNotes().stream().map(note -> note.getId()).toList(),
                                folder.getColor());
        }

        @Transactional
        public void deleteFolder(Long id) {
                Folder folder = folderRepository.findById(id)
                                .orElseThrow(() -> {
                                        logger.error("Pasta não encontrada.");
                                        return new IllegalArgumentException("Pasta não encontrada.");
                                });

                List<Note> notes = folder.getNotes();
                notes.forEach(note -> note.setFolder(null));
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
                return new FolderResponse(folder.getId(), folder.getTitle(), folder.getDescription(),
                                folder.getCreatedAt(),
                                folder.getUpdatedAt(), folder.getNotes().stream().map(note -> note.getId()).toList(),
                                folder.getColor());
        }

        @Transactional(readOnly = true)
        public List<FolderResponse> findAll() {

                User user = getCurrentUser();
                return folderRepository.findByUserIdOrderByIdAsc(user.getId())
                                .stream()
                                .map(folder -> new FolderResponse(folder.getId(), folder.getTitle(),
                                                folder.getDescription(),
                                                folder.getCreatedAt(),
                                                folder.getUpdatedAt(),
                                                folder.getNotes().stream().map(note -> note.getId()).toList(),
                                                folder.getColor()))
                                .toList();
        }

        @Transactional
        public FolderResponse createFolder(FolderRequest folderRequest) {

                User user = getCurrentUser();

                Folder folder = Folder.builder()
                                .title(folderRequest.getTitle())
                                .description(folderRequest.getDescription())
                                .user(user)
                                .color(folderRequest.getColor())
                                .build();

                folderRepository.save(folder);

                List<Note> notes = folderRequest.getNoteIds() == null
                                ? List.of()
                                : folderRequest.getNoteIds().stream()
                                                .distinct()
                                                .map(noteId -> noteRepository.findByIdAndUserId(noteId, user.getId())
                                                                .orElseThrow(() -> {
                                                                        logger.error("Nota não encontrada: " + noteId);
                                                                        return new IllegalArgumentException(
                                                                                        "Nota não encontrada: "
                                                                                                        + noteId);
                                                                }))
                                                .toList();

                notes.forEach(note -> note.setFolder(folder));
                noteRepository.saveAll(notes);
                folder.setNotes(notes);

                logger.info("Pasta criada com sucesso! " + folder.getId());

                return new FolderResponse(folder.getId(), folder.getTitle(), folder.getDescription(),
                                folder.getCreatedAt(),
                                folder.getUpdatedAt(), folder.getNotes().stream().map(note -> note.getId()).toList(),
                                folder.getColor());

        }

}
