export const verifyEmployer = (req, res, next) => {
  if (req.user.role !== "employer") {
    return res.status(403).send({ message: "Forbidden: Employer only" });
  }
  next();
};