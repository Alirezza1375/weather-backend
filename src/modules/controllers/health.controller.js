export const healthCheck = (req, res) => {
  res.status(200).json({
    status: "ok",
    upTime: process.uptime(),
    timeStamp: Date.now(),
  });
};
