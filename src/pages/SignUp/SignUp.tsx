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
import { Link as RouterLink } from 'react-router-dom';
import { MIN_PASSWORD_LEN, MIN_USERNAME_LEN } from '../../constants';

interface Errors {
  username?: string;
  password?: string;
  confirm?: string;
}

export default function SignUp() {
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
    if (values.username.trim().length < MIN_USERNAME_LEN)
      next.username = `At least ${MIN_USERNAME_LEN} characters`;
    if (values.password.length < MIN_PASSWORD_LEN)
      next.password = `At least ${MIN_PASSWORD_LEN} characters`;
    if (values.confirm !== values.password)
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
      // TODO: POST to your NestJS auth endpoint here
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
            Create your account
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
            autoComplete="new-password"
            fullWidth
          />
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

          <Button
            type="submit"
            variant="contained"
            size="large"
            loading={submitting}
            fullWidth
          >
            Sign up
          </Button>

          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            Already have an account?{' '}
            <Link component={RouterLink} to="/signin">
              Sign in
            </Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
