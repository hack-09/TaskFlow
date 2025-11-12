// utils/openaiHelper.js
exports.getTaskInsights = async (description) => {
  return description.includes("urgent")
    ? "High priority"
    : "Moderate importance — due soon.";
};
