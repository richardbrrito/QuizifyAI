export const extractQuestions = async (questions) => {
  // Regular expression to match questions
  const questionRegex = /\d+\.\s(.+?)\?/g;
  const matches = questions.matchAll(questionRegex);

  // Extracted questions object
  const questionsArray = [];

  // Iterate through matches and store in object
  for (const match of matches) {
    // const questionNumber = match[0].split(".")[0];
    const questionText = match[1].trim();
    questionsArray.push(questionText)
  }

  return questionsArray;
};