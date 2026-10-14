import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'films',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('../pages/films/films.page').then((m) => m.FilmsPage),
          },
          {
            path: ':id',
            loadComponent: () =>
              import('../pages/film-detail/film-detail.page').then(
                (m) => m.FilmDetailPage,
              ),
          },
        ],
      },
      {
        path: 'playlist',
        loadComponent: () =>
          import('../pages/playlist/playlist.page').then((m) => m.PlaylistPage),
      },
      {
        path: 'matching',
        loadComponent: () =>
          import('../pages/matching/matching.page').then((m) => m.MatchingPage),
      },
      {
        path: 'profil',
        loadComponent: () =>
          import('../pages/profil/profil.page').then((m) => m.ProfilPage),
      },
      {
        path: '',
        redirectTo: '/tabs/films',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
];
