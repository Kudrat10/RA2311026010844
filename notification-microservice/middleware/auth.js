const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Access denied. No token provided.'
      }
    });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    if (token.length < 5) {
      throw new Error('Invalid token');
    }
    
    req.studentId = token;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Token is invalid or expired'
      }
    });
  }
};

module.exports = authMiddleware;
