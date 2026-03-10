import { Injectable, signal } from '@angular/core'; // ← adicione signal aqui

@Injectable({ providedIn: 'root' })
export class ThemeService {

  private readonly THEME_KEY = 'theme';
  isDarkMode = signal<boolean>(false); // ← tipagem explícita

  constructor() {
    this.loadTheme();
  }

  toggle(): void {
    this.isDarkMode.update((v: boolean) => !v); // ← tipo no parâmetro
    this.applyTheme();
  }

  private applyTheme(): void {
    const dark = this.isDarkMode();
    document.documentElement.setAttribute('data-bs-theme', dark ? 'dark' : 'light');
    localStorage.setItem(this.THEME_KEY, dark ? 'dark' : 'light');
  }

  private loadTheme(): void {
    const saved = localStorage.getItem(this.THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    this.isDarkMode.set(saved ? saved === 'dark' : prefersDark);
    this.applyTheme();
  }
}