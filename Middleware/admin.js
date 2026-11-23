export const authorizeAdmin = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).send({ message: "Admin access required" });
    }
    next();
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

export default authorizeAdmin;