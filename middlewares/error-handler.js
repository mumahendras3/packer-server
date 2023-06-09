function errorHandler(err, req, res, next) {
  if (err.code === 11000) {
    return res.status(400).json({
      message: "This email has already been registered",
    });
  }
  if (err.errors) {
    const [field] = Object.keys(err.errors);
    const { message } = err.errors[field];
    return res.status(400).json({ message });
  }
  if (err.name === "InvalidCredentials") {
    return res.status(401).json({
      message: "Invalid email/password",
    });
  }
  if (err.name === "InvalidToken" || err.name === "JsonWebTokenError") {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
  if (err.name === "RepoNotFound") {
    return res.status(404).json({
      message: "Repository not found in the watch list",
    });
  }
  if (err.name === "TaskNotFound") {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  if (err.name === "TaskNotStarted") {
    return res.status(400).json({
      message: "Task not yet started",
    });
  }
  if (err.name === "TaskFail") {
    return res.status(400).json({
      message: "Task fail",
    });
  }
  if (err.name === "TaskStillRunning") {
    return res.status(400).json({
      message: "Task is still running",
    });
  }

  console.error(err);
  res.status(500).json({
    message: "Internal server error",
  });
}

module.exports = errorHandler;
