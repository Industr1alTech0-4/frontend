export const parseLastValue = (rawString: string): string => {
  console.log(rawString)

  const lines = rawString.split(/\r?\n/).filter(line => line.trim() !== '');
  if (lines.length <= 1) return '—';
  return lines[lines.length - 1].trim();
};