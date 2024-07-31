export type JwtPayload = {
  aud: string;
  azp: string;
  email: string;
  email_verified: boolean;
  exp: number; // Expiration time
  family_name: string;
  given_name: string; // First name
  iat: number; // Issued at
  iss: string;
  jti: string;
  name: string; // Full name
  nbf: number;
  picture: string; // Profile picture URL
  sub: string;
};
