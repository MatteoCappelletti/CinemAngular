import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { environment } from '../../environments/environment';
import { Home } from './home';

describe('Home', () => {
  let fixture: ComponentFixture<Home>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('carica in parallelo le tre sezioni della home', () => {
    fixture.detectChanges();

    for (const endpoint of ['/movie/popular', '/tv/popular', '/person/popular']) {
      const request = httpMock.expectOne((req) => req.url === environment.tmdbApiUrl + endpoint);
      request.flush({ page: 1, results: [], total_pages: 1, total_results: 0 });
    }
  });

  it('mostra in evidenza il primo film con immagine di sfondo', async () => {
    fixture.detectChanges();

    httpMock
      .expectOne((req) => req.url.endsWith('/movie/popular'))
      .flush({
        page: 1,
        total_pages: 1,
        total_results: 2,
        results: [
          { id: 1, title: 'Senza sfondo', backdrop_path: null, overview: '' },
          { id: 2, title: 'Con sfondo', backdrop_path: '/bg.jpg', overview: 'Trama' },
        ],
      });
    httpMock
      .expectOne((req) => req.url.endsWith('/tv/popular'))
      .flush({ page: 1, results: [], total_pages: 1, total_results: 0 });
    httpMock
      .expectOne((req) => req.url.endsWith('/person/popular'))
      .flush({ page: 1, results: [], total_pages: 1, total_results: 0 });

    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).querySelector('.hero h1')?.textContent).toContain(
      'Con sfondo',
    );
  });
});
