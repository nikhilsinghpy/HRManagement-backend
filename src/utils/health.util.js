import os from "os";
const startTime = Date.now();
function heaclthCheck(req, res) {
  const memoryUsage = process.memoryUsage();
  const uptimeSeconds = (Date.now() - startTime) / 1000;

  const data = {
    application: {
      enviroment: process.env.NODE_ENV || "development",
      uptime: `${uptimeSeconds.toFixed(2)} Seconds`,
      memoryUsage: {
        heapTotal: `${(memoryUsage.heapTotal / (1024 * 1024)).toFixed(2)} MB`,
        heapUsed: `${(memoryUsage.heapUsed / (1024 * 1024)).toFixed(2)} MB`,
      },
    },
    system: {
      cpuUsage: os.loadavg().map((avg) => +avg.toFixed(2)),
      totalMemory: `${(os.totalmem() / (1024 * 1024)).toFixed(2)} MB`,
      freeMemory: `${(os.freemem() / (1024 * 1024)).toFixed(2)} MB`,
    },
    timestamp: Date.now(),
  };

  res.status(200).json({
    statusCode: 200,
    data,
    message: "Health Report",
    success: true,
  });
}
export default heaclthCheck;
