/**
   * Read file paths from system clipboard
   * @returns Array of file paths
   */
  export function readFiles(): string[];

  /**
   * Write file paths to system clipboard
   * @param files Array of file paths to write to clipboard
   */
  export function writeFiles(filePaths: string[]): void;

  /**
   * Read text from system clipboard
   * @returns Text content from clipboard
   */
  export function readText(): string;

  /**
   * Write text to system clipboard
   * @param text Text content to write to clipboard
   */
  export function writeText(text: string): void;

  export function version(): string;