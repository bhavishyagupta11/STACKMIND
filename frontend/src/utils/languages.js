export const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript', ext: '.js', monaco: 'javascript' },
  { value: 'typescript', label: 'TypeScript', ext: '.ts', monaco: 'typescript' },
  { value: 'python', label: 'Python', ext: '.py', monaco: 'python' },
  { value: 'java', label: 'Java', ext: '.java', monaco: 'java' },
  { value: 'cpp', label: 'C++', ext: '.cpp', monaco: 'cpp' },
  { value: 'c', label: 'C', ext: '.c', monaco: 'c' },
  { value: 'csharp', label: 'C#', ext: '.cs', monaco: 'csharp' },
  { value: 'go', label: 'Go', ext: '.go', monaco: 'go' },
  { value: 'rust', label: 'Rust', ext: '.rs', monaco: 'rust' },
  { value: 'ruby', label: 'Ruby', ext: '.rb', monaco: 'ruby' },
  { value: 'php', label: 'PHP', ext: '.php', monaco: 'php' },
  { value: 'swift', label: 'Swift', ext: '.swift', monaco: 'swift' },
  { value: 'kotlin', label: 'Kotlin', ext: '.kt', monaco: 'kotlin' },
  { value: 'sql', label: 'SQL', ext: '.sql', monaco: 'sql' },
  { value: 'html', label: 'HTML', ext: '.html', monaco: 'html' },
  { value: 'css', label: 'CSS', ext: '.css', monaco: 'css' },
];

export const getMonacoLanguage = (value) =>
  LANGUAGES.find((l) => l.value === value)?.monaco || 'plaintext';

export const detectLanguageFromFilename = (filename) => {
  const ext = '.' + filename.split('.').pop().toLowerCase();
  return LANGUAGES.find((l) => l.ext === ext)?.value || 'javascript';
};

// Accepted file extensions for upload
export const ACCEPTED_EXTENSIONS = LANGUAGES.map((l) => l.ext).join(',');
