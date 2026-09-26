import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GeminiAdapter } from './geminiAdapter';

// Mock environment variables
vi.mock('../utils/env', () => ({
    ENV: { GOOGLE_API_KEY: 'test-key', GOOGLE_AI_MODEL: 'gemini-1.5-flash' }
}));

// Mock the @google/genai module
const mockGenerateContent = vi.fn();
vi.mock('@google/genai', () => {
    return {
        GoogleGenAI: class {
            models = {
                generateContent: mockGenerateContent
            }
        }
    };
});

describe('GeminiAdapter Retry Logic', () => {
    let adapter: GeminiAdapter;

    beforeEach(() => {
        vi.resetAllMocks();
        vi.useRealTimers();
        adapter = new GeminiAdapter();
    });

    it('should retry on 503/429 errors and eventually succeed', async () => {
        // Fail twice with retryable errors, succeed on the 3rd attempt
        mockGenerateContent
            .mockRejectedValueOnce(new Error('503 Service Unavailable'))
            .mockRejectedValueOnce(new Error('429 Too Many Requests'))
            .mockResolvedValueOnce({ text: 'Success response' });

        const result = await adapter.generateContent('test prompt');

        expect(result).toBe('Success response');
        expect(mockGenerateContent).toHaveBeenCalledTimes(3);
    }, 15000);

    it('should throw ServiceUnavailableException if max retries are exceeded', async () => {
        // Fail continuously with 503
        mockGenerateContent.mockRejectedValue(new Error('503 Service Unavailable'));

        await expect(adapter.generateContent('test prompt'))
            .rejects
            .toThrow('AI generation is currently experiencing high demand');

        // Verify it retried exactly MAX_RETRIES (3) times
        expect(mockGenerateContent).toHaveBeenCalledTimes(3); 
    }, 15000);
});
