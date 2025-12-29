import { translationService } from '../translationService';

describe('translationService', () => {
  it('returns native language names', () => {
    expect(translationService.getLanguageName('en')).toBe('English');
    expect(translationService.getLanguageName('hi')).toBe('हिंदी');
    expect(translationService.getLanguageName('or')).toBe('ଓଡ଼ିଆ');
  });

  it('formats dates consistently', () => {
    const date = new Date('2024-03-01T05:30:00.000Z');
    const formatted = translationService.formatDate(date, 'en');

    expect(typeof formatted).toBe('string');
    expect(formatted.length).toBeGreaterThan(0);
  });
});
