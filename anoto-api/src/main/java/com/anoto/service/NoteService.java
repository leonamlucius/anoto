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
import com.anoto.service.CryptoUtil;

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
        String decryptedContent = note.getContent();
        try {
            decryptedContent = CryptoUtil.decrypt(note.getContent());
        } catch (Exception e) {
            // Se falhar, retorna o conteúdo original (pode logar se quiser)
        }
        return new NoteResponse(
                note.getId(),
                note.getTitle(),
                decryptedContent,
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
        String encryptedContent = request.getContent();
        try {
            encryptedContent = CryptoUtil.encrypt(request.getContent());
        } catch (Exception e) {
            // Se falhar, salva o conteúdo original (pode logar se quiser)
        }
        Note note = Note.builder()
                .title(request.getTitle())
                .content(encryptedContent)
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
        String encryptedContent = request.getContent();
        try {
            encryptedContent = CryptoUtil.encrypt(request.getContent());
        } catch (Exception e) {
            // Se falhar, salva o conteúdo original (pode logar se quiser)
        }
        note.setContent(encryptedContent);
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
