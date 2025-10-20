// User Profile and Birth Data Types

export interface BirthData {
  birth_date: string;           // YYYY-MM-DD format
  birth_time: string;           // HH:MM:SS format
  birth_location: string;       // City name
  birth_latitude: number;       // Decimal degrees
  birth_longitude: number;      // Decimal degrees
  birth_timezone: string;       // IANA timezone (e.g., 'America/New_York')
}

export interface AstrologicalData {
  moon_sign: string;            // Vedic moon sign (Rashi)
  sun_sign: string;             // Vedic sun sign
  ascendant: string;            // Rising sign (Lagna)
  nakshatra: string;            // Birth star
  birth_chart?: any;            // Complete chart data (JSON)
}

export interface UserProfile extends BirthData, AstrologicalData {
  id: string;                   // UUID, references auth.users
  email: string;
  created_at: string;           // ISO timestamp
  updated_at: string;           // ISO timestamp
}

export interface CreateUserProfileInput extends Partial<BirthData> {
  email: string;
}

export interface UpdateUserProfileInput extends Partial<BirthData>, Partial<AstrologicalData> {}
