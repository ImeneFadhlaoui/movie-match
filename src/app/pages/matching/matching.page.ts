import { Component, inject, signal } from '@angular/core';
import { PercentPipe } from '@angular/common';
import {
  IonAvatar, IonContent, IonHeader, IonItem, IonLabel, IonList,
  IonNote, IonSpinner, IonTitle, IonToolbar,
} from '@ionic/angular';
import { Match, MatchingService } from '../../services/matching';

@Component({
  selector: 'app-matching',
  templateUrl: './matching.page.html',
  styleUrls: ['./matching.page.scss'],
  imports: [
    PercentPipe, IonContent, IonHeader, IonTitle, IonToolbar, IonList,
    IonItem, IonLabel, IonAvatar, IonNote, IonSpinner,
  ],
})
export class MatchingPage {
  private matchingService = inject(MatchingService);

  matches = signal<Match[]>([]);
  loading = signal(true);

  async ionViewWillEnter() {
    this.loading.set(true);
    try {
      this.matches.set(await this.matchingService.getMatches());
    } catch (error) {
      console.error('Erreur matching :', error);
    } finally {
      this.loading.set(false);
    }
  }
}