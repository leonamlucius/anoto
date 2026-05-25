package com.anoto.service;

import com.anoto.dto.NoteRequest;
import com.anoto.dto.NoteResponse;
import com.anoto.model.Note;
import com.anoto.model.User;
import com.anoto.repository.NoteRepository;
import com.anoto.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NoteService {

    private final NoteRepository noteRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));
    }

    private NoteResponse toResponse(Note note) {
        return new NoteResponse(
                note.getId(),
                note.getTitle(),
                note.getContent(),
                note.getColor(),
                note.getCreatedAt(),
                note.getUpdatedAt());
    }

    public List<NoteResponse> findAll() {
        return noteRepository.findByUserId(getCurrentUser().getId())
                .stream().map(this::toResponse).toList();
    }

    public NoteResponse findById(Long id) {
        User user = getCurrentUser();
        Note note = noteRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Nota não encontrada."));
        return toResponse(note);
    }

    public NoteResponse create(NoteRequest request) {
        User user = getCurrentUser();
        Note note = Note.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .color(request.getColor())
                .user(user)
                .build();
        return toResponse(noteRepository.save(note));
    }

    public NoteResponse update(Long id, NoteRequest request) {
        User user = getCurrentUser();
        Note note = noteRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Nota não encontrada."));
        note.setTitle(request.getTitle());
        note.setContent(request.getContent());
        note.setColor(request.getColor());
        return toResponse(noteRepository.save(note));
    }

    public void delete(Long id) {
        User user = getCurrentUser();
        Note note = noteRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Nota não encontrada."));
        noteRepository.delete(note);
    }
}
