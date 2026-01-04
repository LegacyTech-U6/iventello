/**
 * @file src/utils/errors.ts
 * @description Classes d'erreur personnalisées pour l'application
 * Gestion homogène des erreurs HTTP
 */

/**
 * Classe de base pour les erreurs applicatives
 */
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Erreur de validation des données
 */
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Erreur d'authentification
 */
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentification requise') {
    super(message, 401, 'AUTHENTICATION_ERROR');
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

/**
 * Erreur d'autorisation
 */
export class AuthorizationError extends AppError {
  constructor(message: string = 'Accès refusé') {
    super(message, 403, 'AUTHORIZATION_ERROR');
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

/**
 * Ressource non trouvée
 */
export class NotFoundError extends AppError {
  constructor(resource: string, id?: string | number) {
    const message = id ? `${resource} #${id} non trouvé` : `${resource} non trouvé`;
    super(message, 404, 'NOT_FOUND');
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * Conflit (ex: SKU dupliqué)
 */
export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT');
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

/**
 * Erreur HTTP générique
 */
export class HttpError extends AppError {
  constructor(statusCode: number, message: string, code?: string) {
    super(message, statusCode, code);
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

/**
 * Erreur de base de données
 */
export class DatabaseError extends AppError {
  constructor(message: string, public originalError?: Error) {
    super(message, 500, 'DATABASE_ERROR');
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}

/**
 * Erreur de configuration
 */
export class ConfigurationError extends AppError {
  constructor(message: string) {
    super(message, 500, 'CONFIGURATION_ERROR');
    Object.setPrototypeOf(this, ConfigurationError.prototype);
  }
}

/**
 * Vérifier si une erreur est une erreur applicative
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * Formater une erreur pour la réponse HTTP
 */
export function formatErrorResponse(error: unknown) {
  if (isAppError(error)) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        statusCode: error.statusCode
      },
      timestamp: new Date()
    };
  }

  // Erreur non gérée
  console.error('Unhandled error:', error);
  return {
    success: false,
    error: {
      message: 'Une erreur interne s\'est produite',
      code: 'INTERNAL_ERROR',
      statusCode: 500
    },
    timestamp: new Date()
  };
}
