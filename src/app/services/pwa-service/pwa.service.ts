import { inject, Injectable } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  private swUpdate = inject(SwUpdate);

  constructor() { }

  verifyUpdate(callback: () => void) {
    // 1. Verifica se o Service Worker está ativo
    if (this.swUpdate.isEnabled) {

      // 2. Escuta quando uma nova versão foi baixada e está pronta
      this.swUpdate.versionUpdates
        .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
        .subscribe(() => {
          callback();
        });
    }
  }

  update() {
    window.location.reload();
  }
}

