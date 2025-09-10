import * as Yup from 'yup';

export const signupSchema = Yup.object().shape({
  name: Yup.string().required('Full name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  regNumber: Yup.string().required('Register number is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  campus: Yup.string().required('Campus is required'),
  classValue: Yup.string().required('Class is required'),
});
