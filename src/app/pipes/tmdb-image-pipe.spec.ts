import { environment } from '../../environments/environment';
import { TmdbImagePipe } from './tmdb-image-pipe';

describe('TmdbImagePipe', () => {
  const pipe = new TmdbImagePipe();

  it("compone l'URL completo a partire dal percorso relativo", () => {
    expect(pipe.transform('/abc123.jpg', 'w500')).toBe(
      `${environment.imageBaseUrl}/w500/abc123.jpg`,
    );
  });

  it('usa w500 come misura predefinita', () => {
    expect(pipe.transform('/abc123.jpg')).toContain('/w500/');
  });

  it("restituisce stringa vuota quando l'immagine manca", () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
    expect(pipe.transform('')).toBe('');
  });
});
