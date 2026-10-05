import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { NoteService } from '../../features/home/services/note.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const noteService = inject(NoteService);

  if (noteService.loading().valueOf()) {
    return next(req);
  }

  noteService.setLoading();
  return next(req).pipe(finalize(() => noteService.setLoading()));
};
