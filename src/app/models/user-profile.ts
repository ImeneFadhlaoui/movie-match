
export interface UserProfile {
  uid: string;
  nom: string;
  prenom: string;
  age: number;
  photoURL: string;
  email: string;
  isAdmin: boolean;
  isDisabled: boolean;
  createdAt?: Date;
}
