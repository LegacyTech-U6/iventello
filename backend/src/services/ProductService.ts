/**
 * @file src/services/ProductService.ts
 * @description Service métier pour la gestion des produits
 * Encapsule toute la logique métier liée aux produits
 * Séparation claire entre le contrôle et le métier
 */

import type {
  IProduct,
  ICreateProductDTO,
  IPaginatedResponse,
  IStockMovement,
  StockMovementType
} from '@types/index';

/**
 * Service métier pour les produits
 * 
 * Responsabilités:
 * - Validation des règles métier
 * - Gestion de la logique complexe
 * - Interaction avec les repositories
 * - Gestion des transactions
 * - Notifications et alertes
 */
export class ProductService {
  /**
   * Crée un nouveau produit
   * 
   * @param enterpriseId ID de l'entreprise
   * @param dto Données du produit
   * @param userId ID de l'utilisateur qui crée
   * @throws ValidationError si les données sont invalides
   * @throws ConflictError si le SKU existe déjà
   * @returns Le produit créé
   */
  async createProduct(
    enterpriseId: number,
    dto: ICreateProductDTO,
    userId: number
  ): Promise<IProduct> {
    // Validation métier
    this.validateProductData(dto);

    // Vérifier l'unicité du SKU
    const existingProduct = await this.getProductBySKU(enterpriseId, dto.sku);
    if (existingProduct) {
      throw new Error(`SKU "${dto.sku}" existe déjà pour cette entreprise`);
    }

    // Vérifier que les prix sont cohérents
    if (dto.sellingPrice < dto.costPrice) {
      console.warn(
        `[PRODUCT] Prix de vente (${dto.sellingPrice}) inférieur au coût (${dto.costPrice})`
      );
    }

    // Créer le produit (à implémenter avec repository)
    const product: IProduct = {
      id: 0, // À générer par la DB
      enterpriseId,
      sku: dto.sku,
      barcode: dto.barcode,
      name: dto.name,
      description: dto.description,
      categoryId: dto.categoryId,
      costPrice: dto.costPrice,
      sellingPrice: dto.sellingPrice,
      minStockLevel: dto.minStockLevel ?? 0,
      maxStockLevel: dto.maxStockLevel,
      quantityOnHand: 0,
      quantityReserved: 0,
      quantityAvailable: 0,
      primarySupplierId: dto.primarySupplierId,
      imageUrl: dto.imageUrl,
      taxRate: 0,
      isActive: true,
      isDiscontinued: false,
      unitOfMeasure: 'piece',
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1
    };

    // Log d'activité
    console.log(`[PRODUCT] Created product: ${product.name} (SKU: ${product.sku})`);

    // Trigger notifications si nécessaire
    await this.notifyProductCreated(product);

    return product;
  }

  /**
   * Met à jour un produit
   * 
   * @param enterpriseId ID de l'entreprise
   * @param productId ID du produit
   * @param updates Données à mettre à jour
   * @param userId ID de l'utilisateur qui met à jour
   */
  async updateProduct(
    enterpriseId: number,
    productId: number,
    updates: Partial<ICreateProductDTO>,
    userId: number
  ): Promise<IProduct> {
    // Récupérer le produit existant
    const product = await this.getProductById(enterpriseId, productId);
    if (!product) {
      throw new Error(`Produit ${productId} non trouvé`);
    }

    // Validation des changements
    if (updates.sku && updates.sku !== product.sku) {
      const existingProduct = await this.getProductBySKU(enterpriseId, updates.sku);
      if (existingProduct) {
        throw new Error(`SKU "${updates.sku}" existe déjà`);
      }
    }

    // Mettre à jour les données
    const updatedProduct = { ...product, ...updates };

    // Log et notifications
    console.log(`[PRODUCT] Updated product: ${updatedProduct.name}`);

    return updatedProduct;
  }

  /**
   * Récupère tous les produits d'une entreprise
   * avec pagination et filtres
   */
  async getAllProducts(
    enterpriseId: number,
    page: number = 1,
    limit: number = 20,
    filters?: {
      categoryId?: number;
      supplierId?: number;
      isActive?: boolean;
      search?: string;
    }
  ): Promise<IPaginatedResponse<IProduct>> {
    // À implémenter avec repository + query builder

    return {
      data: [],
      total: 0,
      page,
      pageSize: limit,
      totalPages: 0
    };
  }

  /**
   * Récupère les produits avec stock faible
   * (quantité ≤ minStockLevel)
   */
  async getLowStockProducts(enterpriseId: number): Promise<IProduct[]> {
    console.log(`[PRODUCT] Fetching low stock products for enterprise ${enterpriseId}`);
    
    // À implémenter
    return [];
  }

  /**
   * Récupère les produits en rupture de stock
   * (quantité = 0)
   */
  async getOutOfStockProducts(enterpriseId: number): Promise<IProduct[]> {
    console.log(`[PRODUCT] Fetching out of stock products for enterprise ${enterpriseId}`);
    
    // À implémenter
    return [];
  }

  /**
   * Récupère un produit par ID
   */
  async getProductById(
    enterpriseId: number,
    productId: number
  ): Promise<IProduct | null> {
    // À implémenter
    return null;
  }

  /**
   * Récupère un produit par SKU
   */
  async getProductBySKU(
    enterpriseId: number,
    sku: string
  ): Promise<IProduct | null> {
    // À implémenter
    return null;
  }

  /**
   * Récupère les produits d'une catégorie
   */
  async getProductsByCategory(
    enterpriseId: number,
    categoryId: number
  ): Promise<IProduct[]> {
    // À implémenter
    return [];
  }

  /**
   * Enregistre un mouvement de stock (achat/vente)
   * Met à jour automatiquement la quantité disponible
   */
  async recordStockMovement(
    enterpriseId: number,
    productId: number,
    type: StockMovementType,
    quantity: number,
    userId: number,
    reason?: string
  ): Promise<IStockMovement> {
    // Valider la quantité
    if (quantity <= 0) {
      throw new Error('La quantité doit être positive');
    }

    // Récupérer le produit
    const product = await this.getProductById(enterpriseId, productId);
    if (!product) {
      throw new Error(`Produit ${productId} non trouvé`);
    }

    // Vérifier si la sortie est possible
    if (type === 'out' && product.quantityAvailable < quantity) {
      throw new Error(
        `Stock insuffisant. Disponible: ${product.quantityAvailable}, Demandé: ${quantity}`
      );
    }

    // Enregistrer le mouvement
    const movement: IStockMovement = {
      id: 0,
      enterpriseId,
      productId,
      type,
      quantity,
      reason,
      createdAt: new Date(),
      createdBy: userId
    };

    // Mettre à jour la quantité (transaction nécessaire)
    await this.updateProductQuantity(productId, type, quantity);

    // Log
    console.log(
      `[STOCK] Movement: ${type} x${quantity} on ${product.name} (reason: ${reason})`
    );

    // Vérifier et générer des notifications
    await this.checkStockAlerts(enterpriseId, product);

    return movement;
  }

  /**
   * Vend un produit (décrémente le stock)
   * Raccourci pour recordStockMovement('out', ...)
   */
  async sellProduct(
    enterpriseId: number,
    productId: number,
    quantity: number,
    userId: number
  ): Promise<IStockMovement> {
    return this.recordStockMovement(
      enterpriseId,
      productId,
      'out',
      quantity,
      userId,
      'Sale'
    );
  }

  /**
   * Reçoit un stock (achète)
   */
  async receiveStock(
    enterpriseId: number,
    productId: number,
    quantity: number,
    supplierId: number,
    userId: number
  ): Promise<IStockMovement> {
    return this.recordStockMovement(
      enterpriseId,
      productId,
      'in',
      quantity,
      userId,
      `Purchase from supplier #${supplierId}`
    );
  }

  /**
   * Supprime un produit (soft delete)
   */
  async deleteProduct(
    enterpriseId: number,
    productId: number,
    userId: number
  ): Promise<void> {
    const product = await this.getProductById(enterpriseId, productId);
    if (!product) {
      throw new Error(`Produit ${productId} non trouvé`);
    }

    // Vérifier si on peut supprimer (pas de ventes, pas de PO ouvertes)
    const hasSales = await this.hasRecordedSales(productId);
    if (hasSales) {
      throw new Error('Impossible de supprimer un produit avec historique de ventes');
    }

    // Soft delete
    console.log(`[PRODUCT] Soft deleted product: ${product.name}`);

    // À implémenter avec repository
  }

  /**
   * Vérifie les alertes de stock
   * Génère des notifications si nécessaire
   */
  private async checkStockAlerts(
    enterpriseId: number,
    product: IProduct
  ): Promise<void> {
    // Alerte stock faible
    if (product.quantityOnHand <= product.minStockLevel && product.quantityOnHand > 0) {
      console.warn(
        `[ALERT] Low stock warning: ${product.name} - ${product.quantityOnHand} remaining`
      );
      // Créer une notification
    }

    // Alerte rupture de stock
    if (product.quantityOnHand === 0) {
      console.warn(`[ALERT] Out of stock: ${product.name}`);
      // Créer une notification
    }

    // Alerte over-stock
    if (
      product.maxStockLevel &&
      product.quantityOnHand > product.maxStockLevel
    ) {
      console.warn(
        `[ALERT] Over stock: ${product.name} - ${product.quantityOnHand} exceeds max`
      );
    }
  }

  /**
   * Valide les données d'un produit
   */
  private validateProductData(dto: ICreateProductDTO): void {
    if (!dto.name || dto.name.trim().length === 0) {
      throw new Error('Le nom du produit est requis');
    }

    if (!dto.sku || dto.sku.trim().length === 0) {
      throw new Error('Le SKU est requis');
    }

    if (dto.costPrice < 0) {
      throw new Error('Le coût doit être positif');
    }

    if (dto.sellingPrice < 0) {
      throw new Error('Le prix de vente doit être positif');
    }

    if (dto.minStockLevel && dto.minStockLevel < 0) {
      throw new Error('Le stock minimum doit être positif');
    }
  }

  /**
   * Utilitaires privés
   */
  private async updateProductQuantity(
    productId: number,
    type: StockMovementType,
    quantity: number
  ): Promise<void> {
    // À implémenter
  }

  private async hasRecordedSales(productId: number): Promise<boolean> {
    // À implémenter
    return false;
  }

  private async notifyProductCreated(product: IProduct): Promise<void> {
    // À implémenter
  }
}

export default ProductService;
