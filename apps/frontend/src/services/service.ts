export const getSecurityTip = async (): Promise<string> => {
  // Mock security tips - in production, this would call an actual AI service
  const tips = [
    "Use a unique password for each account to prevent credential stuffing attacks.",
    "Enable two-factor authentication whenever possible for an extra layer of security.",
    "Be cautious of phishing attempts - always verify the sender before clicking links.",
    "Use a password manager to generate and store strong, unique passwords.",
    "Regularly review your account activity and log out from unused sessions.",
  ];

  return tips[Math.floor(Math.random() * tips.length)];
};
