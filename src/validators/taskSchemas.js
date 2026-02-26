import Joi from 'joi';

const statusValues = ['pending', 'in-progress', 'completed'];

export const createTaskSchema = Joi.object({
  title: Joi.string().trim().min(1).max(120).required(),
  description: Joi.string().trim().min(1).max(2000).required(),
  status: Joi.string().valid(...statusValues).required()
});

export const updateTaskSchema = Joi.object({
  title: Joi.string().trim().min(1).max(120).optional(),
  description: Joi.string().trim().min(1).max(2000).optional(),
  status: Joi.string().valid(...statusValues).optional()
}).min(1);
