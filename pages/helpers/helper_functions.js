export const humanizeText = (text) => {
  return text
    .replace(/_/g, ' ')     // Replace underscores with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
};
