import { Injectable, Logger } from '@nestjs/common';

export type AiPredictionInput = {
  distanceKm: number;
  availabilityScore: number;
  conversionRate: number;
  extensionRate: number;
  price: number;
};

export type AiPredictionResult = {
  score: number;
  recommendation: 'HIGHLY_RECOMMENDED' | 'RECOMMENDED' | 'LOW_PRIORITY';
  source: 'MODEL' | 'FALLBACK';
};

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  private readonly aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';

  async predict(input: AiPredictionInput): Promise<AiPredictionResult> {
    try {
      const response = await fetch(`${this.aiServiceUrl}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error(`AI service error: ${response.status}`);
      }

      const data = await response.json();

      return {
        score: Number(data.score ?? 0),
        recommendation: data.recommendation ?? 'LOW_PRIORITY',
        source: 'MODEL',
      };
    } catch (error) {
      this.logger.warn(
        `AI service unavailable. Falling back to rule-based score. ${error}`,
      );

      return this.fallbackPredict(input);
    }
  }

  private fallbackPredict(input: AiPredictionInput): AiPredictionResult {
    const behaviorScore =
      input.conversionRate * 0.7 + input.extensionRate * 0.3;

    const distanceScore =
      input.distanceKm >= 3 ? 0 : Math.max(0, 1 - input.distanceKm / 3);

    const score = Math.round(
      distanceScore * 40 +
        input.availabilityScore * 25 +
        behaviorScore * 35,
    );

    return {
      score,
      recommendation:
        score >= 70
          ? 'HIGHLY_RECOMMENDED'
          : score >= 40
            ? 'RECOMMENDED'
            : 'LOW_PRIORITY',
      source: 'FALLBACK',
    };
  }
}