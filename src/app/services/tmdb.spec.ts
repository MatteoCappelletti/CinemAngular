import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { TmdbService } from './tmdb';

describe('TmdbService', () => {
  let service: TmdbService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TmdbService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('chiama /movie/popular con la pagina richiesta', () => {
    service.getPopularMovies(3).subscribe();

    const request = httpMock.expectOne(
      (req) => req.url === `${environment.tmdbApiUrl}/movie/popular`,
    );
    expect(request.request.params.get('page')).toBe('3');
    request.flush({ page: 3, results: [], total_pages: 1, total_results: 0 });
  });

  it('usa /discover/movie con with_genres quando è attivo un filtro', () => {
    service.discoverMovies(28).subscribe();

    const request = httpMock.expectOne(
      (req) => req.url === `${environment.tmdbApiUrl}/discover/movie`,
    );
    expect(request.request.params.get('with_genres')).toBe('28');
    request.flush({ page: 1, results: [], total_pages: 1, total_results: 0 });
  });

  it('estrae la lista dei generi dalla risposta annidata', async () => {
    const genres = service.getMovieGenres();
    const promise = new Promise((resolve) => genres.subscribe(resolve));

    httpMock
      .expectOne(`${environment.tmdbApiUrl}/genre/movie/list`)
      .flush({ genres: [{ id: 28, name: 'Azione' }] });

    expect(await promise).toEqual([{ id: 28, name: 'Azione' }]);
  });

  it('chiede cast e troupe insieme alla scheda film', () => {
    service.getMovieDetails(603).subscribe();

    const request = httpMock.expectOne((req) => req.url === `${environment.tmdbApiUrl}/movie/603`);
    expect(request.request.params.get('append_to_response')).toBe('credits');
    request.flush({});
  });

  it('chiede cast e troupe insieme alla scheda serie', () => {
    service.getTvDetails(1399).subscribe();

    const request = httpMock.expectOne((req) => req.url === `${environment.tmdbApiUrl}/tv/1399`);
    expect(request.request.params.get('append_to_response')).toBe('credits');
    request.flush({});
  });

  it('cerca su /search/multi passando la query', () => {
    service.searchMulti('matrix').subscribe();

    const request = httpMock.expectOne(
      (req) => req.url === `${environment.tmdbApiUrl}/search/multi`,
    );
    expect(request.request.params.get('query')).toBe('matrix');
    request.flush({ page: 1, results: [], total_pages: 1, total_results: 0 });
  });

  it('carica la filmografia combinata di una persona', () => {
    service.getPersonCredits(287).subscribe();

    httpMock
      .expectOne(`${environment.tmdbApiUrl}/person/287/combined_credits`)
      .flush({ cast: [], crew: [] });
  });
});
