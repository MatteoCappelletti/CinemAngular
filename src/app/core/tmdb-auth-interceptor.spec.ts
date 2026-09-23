import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { tmdbAuthInterceptor } from './tmdb-auth-interceptor';

describe('tmdbAuthInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([tmdbAuthInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('aggiunge il bearer token e la lingua alle chiamate TMDB', () => {
    http.get(`${environment.tmdbApiUrl}/movie/popular`).subscribe();

    const request = httpMock.expectOne((req) => req.url.startsWith(environment.tmdbApiUrl));
    expect(request.request.headers.get('Authorization')).toBe(`Bearer ${environment.tmdbToken}`);
    expect(request.request.params.get('language')).toBe(environment.language);
    request.flush({});
  });

  it('non tocca le richieste verso altri domini', () => {
    http.get('/assets/config.json').subscribe();

    const request = httpMock.expectOne('/assets/config.json');
    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush({});
  });
});
