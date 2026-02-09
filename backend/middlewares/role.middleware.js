const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    //req.user is already set by authMidleware
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Forbidden: You don't have permission to access this resource",
      });
    }
    next();
  };
};

export default authorizeRoles;
