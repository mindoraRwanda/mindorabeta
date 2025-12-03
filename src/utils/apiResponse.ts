export const successResponse = (res: any, data: any, message = 'Success', status = 200) => {
  res.status(status).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (res: any, message = 'Error', status = 500, error?: any) => {
  res.status(status).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? error : {},
  });
};