/**
 * @file src/controller/ProductController.ts
 * @description Contrôleur pour les produits (version TypeScript refactorisée)
 * 
 * Responsabilités:
 * - Récupérer les données des requêtes
 * - Appeler le service métier
 * - Formater les réponses
 * - Gérer les erreurs HTTP
 * 
 * La logique métier reste dans ProductService
 */

import type {
  Request,
  Response,
  NextFunction
} from 'express';

import type {
  IProduct,
  ICreateProductDTO,
  IApiResponse,
  IPaginatedResponse,
  IUserContext
} from '@types/index';

import ProductService from '@services/ProductService';
import { HttpError, ValidationError } from '@utils/errors';

/**
 * Extension de Request avec contexte utilisateur
 */
declare global {
  namespace Express {
    interface Request {
      user?: IUserContext;
      enterpriseId?: number;
    }
  }
}

/**
 * Contrôleur des produits
 */
export class ProductController {
  private productService: ProductService;

  constructor(productService: ProductService) {
    this.productService = productService;
  }

  /**
   * GET /api/products
   * Récupère tous les produits de l'entreprise
   * 
   * Query params:
   * - page: number (default: 1)
   * - limit: number (default: 20)
   * - categoryId: number (filter)
   * - search: string (filter)
   */
  async getAllProducts(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const enterpriseId = this.getEntrepriseId(req);
      
      // Valider et extraire les paramètres de pagination
      const { page, limit, categoryId, search } = this.extractPaginationParams(req);

      // Appeler le service
      const result = await this.productService.getAllProducts(
        enterpriseId,
        page,
        limit,
        { categoryId, search }
      );

      // Répondre
      this.sendSuccess(res, result, 'Produits récupérés avec succès');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/products/:id
   * Récupère un produit par son ID
   */
  async getProductById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const enterpriseId = this.getEntrepriseId(req);

      // Valider l'ID
      const productId = this.validateIntId(id);

      // Récupérer le produit
      const product = await this.productService.getProductById(
        enterpriseId,
        productId
      );

      if (!product) {
        throw new HttpError(404, 'Produit non trouvé');
      }

      this.sendSuccess(res, product, 'Produit récupéré');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/products
   * Crée un nouveau produit
   * 
   * Body:
   * {
   *   name: string,
   *   sku: string,
   *   costPrice: number,
   *   sellingPrice: number,
   *   categoryId?: number,
   *   minStockLevel?: number,
   *   description?: string
   * }
   */
  async createProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const enterpriseId = this.getEntrepriseId(req);
      const userId = this.getUserId(req);

      // Valider les données
      const dto = this.validateCreateProductDTO(req.body);

      // Créer le produit
      const product = await this.productService.createProduct(
        enterpriseId,
        dto,
        userId
      );

      // Répondre avec le produit créé
      res.status(201);
      this.sendSuccess(res, product, 'Produit créé avec succès');
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/products/:id
   * Met à jour un produit
   */
  async updateProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const enterpriseId = this.getEntrepriseId(req);
      const userId = this.getUserId(req);

      const productId = this.validateIntId(id);
      const updates = this.validatePartialProductDTO(req.body);

      // Mettre à jour
      const product = await this.productService.updateProduct(
        enterpriseId,
        productId,
        updates,
        userId
      );

      this.sendSuccess(res, product, 'Produit mis à jour');
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/products/:id
   * Supprime un produit
   */
  async deleteProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const enterpriseId = this.getEntrepriseId(req);
      const userId = this.getUserId(req);

      const productId = this.validateIntId(id);

      await this.productService.deleteProduct(enterpriseId, productId, userId);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/products/low-stock
   * Récupère les produits avec stock faible
   */
  async getLowStockProducts(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const enterpriseId = this.getEntrepriseId(req);

      const products = await this.productService.getLowStockProducts(enterpriseId);

      this.sendSuccess(
        res,
        { data: products, count: products.length },
        'Produits à stock faible'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/products/out-of-stock
   * Récupère les produits en rupture de stock
   */
  async getOutOfStockProducts(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const enterpriseId = this.getEntrepriseId(req);

      const products = await this.productService.getOutOfStockProducts(enterpriseId);

      this.sendSuccess(
        res,
        { data: products, count: products.length },
        'Produits en rupture'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/products/:id/sell
   * Enregistre une vente (décrémente le stock)
   * 
   * Body: { quantity: number }
   */
  async sellProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      const enterpriseId = this.getEntrepriseId(req);
      const userId = this.getUserId(req);

      const productId = this.validateIntId(id);

      if (!Number.isInteger(quantity) || quantity <= 0) {
        throw new ValidationError('La quantité doit être un nombre positif');
      }

      const movement = await this.productService.sellProduct(
        enterpriseId,
        productId,
        quantity,
        userId
      );

      this.sendSuccess(res, movement, 'Vente enregistrée');
    } catch (error) {
      next(error);
    }
  }

  /**
   * HELPERS - Extraction des données
   */

  /**
   * Extrait l'ID de l'entreprise du contexte
   */
  private getEntrepriseId(req: Request): number {
    const enterpriseId = req.enterpriseId || req.user?.entrepriseId;
    
    if (!enterpriseId) {
      throw new HttpError(400, 'Enterprise ID manquant du contexte');
    }

    return enterpriseId;
  }

  /**
   * Extrait l'ID de l'utilisateur du contexte
   */
  private getUserId(req: Request): number {
    const userId = req.user?.userId;
    
    if (!userId) {
      throw new HttpError(401, 'Authentification requise');
    }

    return userId;
  }

  /**
   * Valide et extrait les paramètres de pagination
   */
  private extractPaginationParams(req: Request): {
    page: number;
    limit: number;
    categoryId?: number;
    search?: string;
  } {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));

    return {
      page,
      limit,
      categoryId: req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined,
      search: req.query.search as string
    };
  }

  /**
   * Valide un ID entier
   */
  private validateIntId(id: string): number {
    const parsedId = parseInt(id);
    
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      throw new ValidationError('ID invalide');
    }

    return parsedId;
  }

  /**
   * Valide les données pour créer un produit
   */
  private validateCreateProductDTO(body: any): ICreateProductDTO {
    if (!body.name?.trim()) {
      throw new ValidationError('Le nom est requis');
    }

    if (!body.sku?.trim()) {
      throw new ValidationError('Le SKU est requis');
    }

    if (typeof body.costPrice !== 'number' || body.costPrice < 0) {
      throw new ValidationError('Le coût doit être un nombre positif');
    }

    if (typeof body.sellingPrice !== 'number' || body.sellingPrice < 0) {
      throw new ValidationError('Le prix de vente doit être un nombre positif');
    }

    return {
      name: body.name.trim(),
      sku: body.sku.trim(),
      costPrice: body.costPrice,
      sellingPrice: body.sellingPrice,
      categoryId: body.categoryId,
      minStockLevel: body.minStockLevel,
      maxStockLevel: body.maxStockLevel,
      description: body.description,
      barcode: body.barcode,
      imageUrl: body.imageUrl,
      primarySupplierId: body.primarySupplierId
    };
  }

  /**
   * Valide les données partielles pour mettre à jour
   */
  private validatePartialProductDTO(body: any): Partial<ICreateProductDTO> {
    const updates: Partial<ICreateProductDTO> = {};

    if (body.name !== undefined) {
      if (!body.name.trim()) {
        throw new ValidationError('Le nom ne peut pas être vide');
      }
      updates.name = body.name.trim();
    }

    if (body.costPrice !== undefined) {
      if (typeof body.costPrice !== 'number' || body.costPrice < 0) {
        throw new ValidationError('Le coût doit être un nombre positif');
      }
      updates.costPrice = body.costPrice;
    }

    if (body.sellingPrice !== undefined) {
      if (typeof body.sellingPrice !== 'number' || body.sellingPrice < 0) {
        throw new ValidationError('Le prix de vente doit être un nombre positif');
      }
      updates.sellingPrice = body.sellingPrice;
    }

    // ... autres champs

    return updates;
  }

  /**
   * Envoie une réponse succès formatée
   */
  private sendSuccess<T>(
    res: Response,
    data: T,
    message?: string
  ): void {
    const response: IApiResponse<T> = {
      success: true,
      data,
      message,
      timestamp: new Date()
    };

    res.json(response);
  }
}

export default ProductController;
