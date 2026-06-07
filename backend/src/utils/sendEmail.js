const sendEmail = async ({ to, subject, html }) => {
  // Email disabled - enable when domain is configured
  console.log("Email skipped (no domain configured):", to);
};

module.exports = sendEmail;