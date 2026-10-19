import { Component, inject, signal } from '@angular/core';
import { PercentPipe } from '@angular/common';
import {
  IonAvatar, IonCard, IonContent, IonHeader, IonIcon, IonProgressBar,
  IonRefresher, IonRefresherContent, IonSpinner, IonTitle, IonToolbar,
  RefresherCustomEvent,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { peopleOutline, personCircleOutline } from 'ionicons/icons';
import { Match, MatchingService } from '../../services/matching';

@Component({
  selector: 'app-matching',
  templateUrl: './matching.page.html',
  styleUrls: ['./matching.page.scss'],
  imports: [
    PercentPipe, IonContent, IonHeader, IonTitle, IonToolbar, IonCard,
    IonAvatar, IonIcon, IonProgressBar, IonSpinner, IonRefresher,
    IonRefresherContent,
  ],
})
export class MatchingPage {
  private matchingService = inject(MatchingService);

  matches = signal<Match[]>([]);
  loading = signal(true);

  constructor() {
    addIcons({ peopleOutline, personCircleOutline });
  }

  async ionViewWillEnter() {
    this.loading.set(true);
    await this.loadMatches();
    this.loading.set(false);
  }

  // Tirer vers le bas pour actualiser
  async onRefresh(event: RefresherCustomEvent) {
    await this.loadMatches();
    await event.target.complete();
  }

  private async loadMatches() {
    try {
      this.matches.set(await this.matchingService.getMatches());
    } catch (error) {
      console.error('Erreur matching :', error);
    }
  }
}