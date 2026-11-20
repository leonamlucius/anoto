package com.anoto.service;

import com.anoto.dto.NoteRequest;
import com.anoto.dto.NoteResponse;
import com.anoto.mapper.NoteMapper;
import com.anoto.model.Note;
import com.anoto.model.User;
import com.anoto.repository.NoteRepository;
import com.anoto.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import com.anoto.service.CryptoUtil;

@Service
@RequiredArgsConstructor
public class NoteService {

    private final NoteRepository noteRepository;
    private final UserRepository userRepository;
    private final NoteMapper noteMapper;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));
    }

    public List<NoteResponse> findAll() {

        List<Note> notes = noteRepository.findByUserId(getCurrentUser().getId());
        return notes.stream().map(noteMapper::toResponse).toList();
    }

    public NoteResponse findById(Long id) {
        User user = getCurrentUser();
        Note note = noteRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Nota não encontrada."));
        return noteMapper.toResponse(note);
    }

    public NoteResponse create(NoteRequest request) {
        User user = getCurrentUser();
        String encryptedContent = request.content();

        Note note = noteMapper.toEntity(request);
        note.setUser(user);
        note.setFixed(false);
        return noteMapper.toResponse(noteRepository.save(note));
    }

    public NoteResponse update(Long id, NoteRequest request) {
        User user = getCurrentUser();
        Note note = noteRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Nota não encontrada."));
        note.setTitle(noteMapper.encryptContent(request.title()));
        note.setContent(noteMapper.encryptContent(request.content()));
        note.setColor(request.color());
        note.setUpdatedAt(LocalDateTime.now());
        return noteMapper.toResponse(noteRepository.save(note));
    }

    public NoteResponse updatePartial(Long id, NoteRequest request) {
        User user = getCurrentUser();
        Note note = noteRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Nota não encontrada."));
        if (request.title() != null) {
            note.setTitle(request.title());
        }
        if (request.content() != null) {
            note.setContent(noteMapper.encryptContent(request.content()));
        }
        if (request.color() != null) {
            note.setColor(request.color());
        }
        note.setUpdatedAt(LocalDateTime.now());
        return noteMapper.toResponse(noteRepository.save(note));
    }

    public NoteResponse fixedNote(Long id) {
        User user = getCurrentUser();
        Note note = noteRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Nota não encontrada."));
        note.setFixed(!note.getFixed());
        return noteMapper.toResponse(noteRepository.save(note));
    }

    public void delete(Long id) {
        User user = getCurrentUser();
        Note note = noteRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Nota não encontrada."));
        noteRepository.delete(note);
    }
}
