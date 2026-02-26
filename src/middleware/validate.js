import Joi from 'joi';

export const validate = (schema) => (req, res, next) => {
  const options = { abortEarly: false, stripUnknown: true };
  const { error, value } = schema.validate(req.body, options);

  if (error) {
    const details = error.details.map((detail) => detail.message);
    return res.status(400).json({ message: 'Validation error', details });
  }

  req.body = value;
  return next();
};
