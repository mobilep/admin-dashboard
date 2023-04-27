import { Injectable } from '@angular/core';
// models
import { Language } from '../models/language.interface';

@Injectable()
export class LanguagesService {
  private languagesStore = [
    { id: 'en', name: 'English' },
    { id: 'fr', name: 'French' },
    { id: 'it', name: 'Italian' },
    { id: 'es', name: 'Spanish' },
    { id: 'ru', name: 'Russian' },
    { id: 'de', name: 'German' },
    { id: 'ja', name: 'Japanese' },
    { id: 'ko', name: 'Korean' },
    { id: 'ch', name: 'Chinese' },
  ];

  constructor() {}

  /**
   * @description - Method for return languages list
   * @returns Promise
   * @memberOf LanguagesService
   */
  getLanguages(): Promise<Language[]> {
    return Promise.resolve(this.languagesStore);
  }
}
