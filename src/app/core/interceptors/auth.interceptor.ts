import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authRequest = req.clone({
    headers: req.headers.set(
      'Authorization',
      `Bearer ${localStorage.getItem('token')}`,
    ),
  });
  return next(authRequest);
};
