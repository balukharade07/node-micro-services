import { body, validationResult } from 'express-validator';

export const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Email is requierd')
    .notEmpty()
    .withMessage('Email is requierd')
    .isString()
    .withMessage('Email must be a string.'),
  body('password').notEmpty().withMessage('Password is requierd.'),
];

export const userRegisterValidation = [
  body('email')
    .isEmail()
    .withMessage('Email is requierd')
    .notEmpty()
    .withMessage('Email is requierd')
    .isString()
    .withMessage('Email must be a string.'),
  body('firstName')
    .notEmpty()
    .withMessage('Name is requierd.')
    .isLength({ min: 3, max: 32 }),
  body('lastName')
    .notEmpty()
    .withMessage('Last Name is requierd.')
    .isLength({ min: 3, max: 32 }),
  body('age').notEmpty().withMessage('Age is requierd.'),
  body('password').notEmpty().withMessage('Password is requierd.'),
];

export const handleValidation = (req, resp, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    resp.status(400).send({ errors: result.array() });
    return;
  } else {
    next();
  }
};

export const handleUpdatedUserCalidation = (req, res, next) => {
  const allowedFields = ['firstName', 'lastName', 'email', 'age', 'gender'];
  const isValidData = Object.keys(req.body || {})?.every((item) =>
    allowedFields.includes(item),
  );

  if (!isValidData) return res.status(400).send('invalid json.');

  next();
};
