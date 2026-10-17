import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButton, IonContent, IonHeader, IonRouterLink, IonTitle, IonToolbar } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { FirebaseService } from '../../services/firebase';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, RouterLink, IonRouterLink]
})
export class LoginPage implements OnInit {

  private firebase = inject(FirebaseService);

  ngOnInit() {
  
  }

}
