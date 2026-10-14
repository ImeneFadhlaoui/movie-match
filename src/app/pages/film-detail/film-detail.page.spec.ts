import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilmDetailPage } from './film-detail.page';

describe('FilmDetailPage', () => {
  let component: FilmDetailPage;
  let fixture: ComponentFixture<FilmDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FilmDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
