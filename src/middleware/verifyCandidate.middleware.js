export const verifyCandidate = (req, res, next) => {
  if (req.user.role !== "candidate") {
    return res.status(403).send({ message: "Forbidden: Candidates only" });
  }
  next();
};