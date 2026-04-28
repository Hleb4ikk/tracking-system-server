import jwt from 'jsonwebtoken';

export function verifyJwt<P>(
  token: string,
  secret: string,
  throwableError: Error,
  options?: jwt.VerifyOptions,
) {
  try {
    return jwt.verify(token, secret, options) as P;
  } catch {
    throw throwableError;
  }
}
