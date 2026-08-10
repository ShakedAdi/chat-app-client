import { useState } from 'react';
import {
  Box,
  Paper,
  Stack,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  MAX_USERNAME_LEN,
  MIN_PASSWORD_LEN,
  MIN_USERNAME_LEN,
  USERNAME_PATTERN,
} from '../../constants';
import { signIn, signUp } from '../../api';
import { AuthAction, type Errors } from './types';

interface AuthProps {
  action: AuthAction;
}

export default function Auth({ action }: AuthProps) {
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [values, setValues] = useState({
    username: '',
    password: '',
    confirm: '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const getErrors = (): Errors => {
    const next: Errors = {};
    const username = values.username.trim();

    if (username.length < MIN_USERNAME_LEN)
      next.username = `At least ${MIN_USERNAME_LEN} characters`;
    else if (username.length > MAX_USERNAME_LEN)
      next.username = `At most ${MAX_USERNAME_LEN} characters`;
    else if (!USERNAME_PATTERN.test(username))
      next.username = 'Letters, numbers and underscores only';

    if (values.password.length < MIN_PASSWORD_LEN)
      next.password = `At least ${MIN_PASSWORD_LEN} characters`;
    if (action === AuthAction.SIGNUP && values.confirm !== values.password)
      next.confirm = 'Passwords do not match';
    return next;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errorsFound = getErrors();
    setErrors(errorsFound);
    if (Object.keys(errorsFound).length > 0) return;

    setSubmitting(true);
    setSubmitError('');
    try {
      const payload = {
        username: values.username.trim(),
        password: values.password,
      };

      if (action === AuthAction.SIGNUP) {
        await signUp(payload);
      } else {
        await signIn(payload);
      }

      await refresh();

      navigate('/chat', { replace: true });
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Something went wrong',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{ minHeight: '100dvh', display: 'grid', placeItems: 'center', p: 2 }}
    >
      <Paper variant="outlined" sx={{ p: 4, width: '100%', maxWidth: 420 }}>
        <Stack component="form" onSubmit={handleSubmit} noValidate spacing={2}>
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: 700, mb: 1 }}
          >
            {action === AuthAction.SIGNUP
              ? 'Create your account'
              : 'Sign in to your account'}
          </Typography>

          {submitError && <Alert severity="error">{submitError}</Alert>}

          <TextField
            name="username"
            label="Username"
            value={values.username}
            onChange={handleChange}
            error={!!errors.username}
            helperText={errors.username ?? ' '}
            autoComplete="username"
            autoFocus
            fullWidth
          />
          <TextField
            name="password"
            label="Password"
            type="password"
            value={values.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password ?? ' '}
            autoComplete={
              action === AuthAction.SIGNUP ? 'new-password' : 'current-password'
            }
            fullWidth
          />
          {action === AuthAction.SIGNUP && (
            <TextField
              name="confirm"
              label="Confirm password"
              type="password"
              value={values.confirm}
              onChange={handleChange}
              error={!!errors.confirm}
              helperText={errors.confirm ?? ' '}
              autoComplete="new-password"
              fullWidth
            />
          )}

          <Button
            type="submit"
            variant="contained"
            size="large"
            loading={submitting}
            fullWidth
          >
            {action === AuthAction.SIGNUP ? 'Sign up' : 'Sign in'}
          </Button>

          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            {action === AuthAction.SIGNUP
              ? 'Already have an account? '
              : "Don't have an account? "}
            <Link
              component={RouterLink}
              to={action === AuthAction.SIGNUP ? '/signin' : '/signup'}
            >
              {action === AuthAction.SIGNUP ? 'Sign in' : 'Sign up'}
            </Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
