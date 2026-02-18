export type ChatProvider = 'OPENROUTER' | 'OPENAI' | 'ANTHROPIC';

export interface ChatbotConfig {
  activeProvider: ChatProvider;
  enabled: boolean;
  openRouterModel: string;
  openAiModel: string;
  anthropicModel: string;
  temperature: number;
  maxTokens: number;
  allowedTopicsCsv: string;
  outOfScopeMessage: string;
  systemPrompt: string;
  currentFocusProjectIdsCsv: string;
  profileStacksCsv: string;
}

export interface ChatbotProjectOption {
  id: number;
  title: string;
  category: string;
}
