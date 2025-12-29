import Voice, {
  SpeechStartEvent,
  SpeechEndEvent,
  SpeechErrorEvent,
  SpeechResultsEvent,
} from '@react-native-voice/voice';
import { SupportedLanguage } from '../types';

class SpeechService {
  constructor() {
    Voice.onSpeechStart = this.onSpeechStart;
    Voice.onSpeechEnd = this.onSpeechEnd;
    Voice.onSpeechError = this.onSpeechError;
    Voice.onSpeechResults = this.onSpeechResults;
  }

  private onSpeechStart = (e: SpeechStartEvent) => {
    console.log('onSpeechStart: ', e);
  };

  private onSpeechEnd = (e: SpeechEndEvent) => {
    console.log('onSpeechEnd: ', e);
  };

  private onSpeechError = (e: SpeechErrorEvent) => {
    console.log('onSpeechError: ', e);
    if (this.onError) {
      this.onError(e.error?.message || 'Unknown speech error');
    }
  };

  private onSpeechResults = (e: SpeechResultsEvent) => {
    console.log('onSpeechResults: ', e);
    if (this.onResults && e.value) {
      this.onResults(e.value);
    }
  };

  private onResults: ((results: string[]) => void) | null = null;
  private onError: ((error: string) => void) | null = null;

  async requestPermissions(): Promise<void> {
    // Permissions are handled by the user's OS settings for Expo Go.
    // For standalone apps, you might need to use a library like react-native-permissions.
    console.log('Permissions requested for voice.');
  }

  startListening(
    onResults: (results: string[]) => void,
    onError: (error: string) => void,
    locale: SupportedLanguage,
  ): void {
    this.onResults = onResults;
    this.onError = onError;
    const localeMap = {
      en: 'en-US',
      hi: 'hi-IN',
      or: 'or-IN',
    };

    Voice.start(localeMap[locale]).catch(error => {
      console.error('Failed to start listening:', error);
      onError('Failed to start listening.');
    });
  }

  stopListening(): void {
    Voice.stop().catch(error => {
      console.error('Failed to stop listening:', error);
    });
  }

  destroy(): void {
    Voice.destroy()
      .then(Voice.removeAllListeners)
      .catch(error => {
        console.error('Failed to destroy voice service:', error);
      });
  }
}

export const speechService = new SpeechService();
