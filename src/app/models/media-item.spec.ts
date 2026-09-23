import { Movie, MultiSearchResult, TvShow } from './tmdb.models';
import {
  detailRoute,
  movieToMediaItem,
  searchResultToMediaItem,
  tvToMediaItem,
} from './media-item';

describe('media-item', () => {
  const movie = {
    id: 603,
    title: 'Matrix',
    overview: 'Trama',
    poster_path: '/poster.jpg',
    release_date: '1999-03-30',
    vote_average: 8.2,
  } as Movie;

  const tv = {
    id: 1399,
    name: 'Il Trono di Spade',
    overview: 'Trama',
    poster_path: '/poster.jpg',
    first_air_date: '2011-04-17',
    vote_average: 8.4,
  } as TvShow;

  it('normalizza title/release_date dei film', () => {
    expect(movieToMediaItem(movie)).toMatchObject({
      mediaType: 'movie',
      title: 'Matrix',
      date: '1999-03-30',
    });
  });

  it('normalizza name/first_air_date delle serie negli stessi campi', () => {
    expect(tvToMediaItem(tv)).toMatchObject({
      mediaType: 'tv',
      title: 'Il Trono di Spade',
      date: '2011-04-17',
    });
  });

  it('smista i risultati di /search/multi in base a media_type', () => {
    const person = {
      media_type: 'person',
      id: 287,
      name: 'Brad Pitt',
      profile_path: '/p.jpg',
      known_for_department: 'Acting',
      popularity: 10,
    } as MultiSearchResult;

    expect(searchResultToMediaItem(person)).toMatchObject({
      mediaType: 'person',
      title: 'Brad Pitt',
      subtitle: 'Acting',
      voteAverage: null,
    });
  });

  it('costruisce il link di dettaglio corretto per ogni tipo', () => {
    expect(detailRoute({ id: 1, mediaType: 'movie' })).toEqual(['/film', '1']);
    expect(detailRoute({ id: 2, mediaType: 'tv' })).toEqual(['/serie', '2']);
    expect(detailRoute({ id: 3, mediaType: 'person' })).toEqual(['/persone', '3']);
  });
});
