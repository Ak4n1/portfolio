import { Injectable } from '@angular/core';

const NOTIFICATION_SOUND_PATH = '/assets/sounds/notification.mp3';

/**
 * Reproduce el sonido de notificación (campanita).
 * Si el navegador bloquea autoplay, se ignora silenciosamente.
 */
@Injectable({
  providedIn: 'root',
})
export class NotificationSoundService {
  play(): void {
    try {
      const audio = new Audio(NOTIFICATION_SOUND_PATH);
      audio.volume = 0.6;
      void audio.play().catch(() => {});
    } catch {
      // ignore
    }
  }
}
