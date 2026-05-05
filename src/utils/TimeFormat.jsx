export const getTimeAgo = (dateString) => {
  const now = new Date();
  const postedDate = new Date(dateString);

  const diffInSeconds = Math.floor((now - postedDate) / 1000);

  const minutes = Math.floor(diffInSeconds / 60);
  const hours = Math.floor(diffInSeconds / 3600);
  const days = Math.floor(diffInSeconds / 86400);
  const weeks = Math.floor(diffInSeconds / (86400 * 7));
  const months = Math.floor(diffInSeconds / (86400 * 30));

  if (diffInSeconds < 60) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (weeks < 4) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;

  return postedDate.toLocaleDateString(); // fallback
};