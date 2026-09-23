import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Details } from './details';

describe('Details', () => {
  let fixture: ComponentFixture<Details>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Details],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Details);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('carica la scheda film e ne mostra titolo e anno', async () => {
    fixture.componentRef.setInput('id', '603');
    fixture.componentRef.setInput('mediaType', 'movie');
    fixture.detectChanges();

    httpMock
      .expectOne((req) => req.url.endsWith('/movie/603'))
      .flush({
        id: 603,
        title: 'Matrix',
        release_date: '1999-03-30',
        overview: 'Trama',
        vote_average: 8.2,
        vote_count: 100,
        poster_path: null,
        backdrop_path: null,
        tagline: null,
        runtime: 136,
        genres: [{ id: 28, name: 'Azione' }],
        credits: {
          cast: [],
          crew: [
            {
              id: 1,
              name: 'Lana Wachowski',
              job: 'Director',
              department: 'Directing',
              profile_path: null,
            },
          ],
        },
      });
    await fixture.whenStable();

    const html = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(html).toContain('Matrix');
    expect(html).toContain('1999');
    // Il ruolo "Director" va mostrato tradotto insieme al nome del regista.
    expect(html).toContain('Regia');
    expect(html).toContain('Lana Wachowski');
  });

  it("interroga l'endpoint delle serie quando mediaType è tv", async () => {
    fixture.componentRef.setInput('id', '1399');
    fixture.componentRef.setInput('mediaType', 'tv');
    fixture.detectChanges();

    const request = httpMock.expectOne((req) => req.url.endsWith('/tv/1399'));
    expect(request.request.params.get('append_to_response')).toBe('credits');
    request.flush({
      id: 1399,
      name: 'Il Trono di Spade',
      first_air_date: '2011-04-17',
      overview: '',
      vote_average: 8.4,
      vote_count: 10,
      poster_path: null,
      backdrop_path: null,
      tagline: null,
      genres: [],
      number_of_seasons: 8,
      number_of_episodes: 73,
      episode_run_time: [60],
      created_by: [],
      credits: { cast: [], crew: [] },
    });
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('8 stagioni · 73 episodi');
  });
});
