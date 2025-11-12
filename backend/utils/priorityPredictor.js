exports.predictPriority = (task) => {
  const { dueDate, description } = task;
  const hoursLeft = (new Date(dueDate) - new Date()) / 36e5;

  if (/urgent|important|asap/i.test(description)) return "High";
  if (hoursLeft < 24) return "High";
  if (hoursLeft < 72) return "Medium";
  return "Low";
};
