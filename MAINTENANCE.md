# ✅ Maintenance & Checklist - Iventello

Ce document est une checklist pour maintenir ton projet en bon état.

---

## 📅 Maintenance Quotidienne

- [ ] Vérifier les logs de l'API (erreurs, warnings)
- [ ] Vérifier les notifications non lues
- [ ] Tester les fonctionnalités principales
- [ ] Vérifier la connexion database

---

## 📅 Maintenance Hebdomadaire

### Code & Quality

- [ ] Exécuter les tests
  ```bash
  npm run test:unit
  npm run test:e2e
  ```

- [ ] Linter le code
  ```bash
  npm run lint
  npm run format
  ```

- [ ] Vérifier les types TypeScript
  ```bash
  npm run type-check
  ```

### Security

- [ ] Vérifier les dépendances obsolètes
  ```bash
  npm outdated
  ```

- [ ] Vérifier les vulnérabilités
  ```bash
  npm audit
  npm audit fix
  ```

- [ ] Vérifier les tokens JWT expirés
- [ ] Vérifier les comptes inactifs

### Performance

- [ ] Vérifier la taille du bundle
  ```bash
  npm run build
  # Comparer la taille de 'dist'
  ```

- [ ] Vérifier la performance API (temps de réponse)
- [ ] Vérifier les erreurs 404/500 en production
- [ ] Vérifier l'utilisation CPU/RAM du serveur

---

## 📅 Maintenance Mensuelle

### Updates & Dependencies

- [ ] Mettre à jour les dépendances mineures
  ```bash
  npm update
  npm test  # Après update
  ```

- [ ] Vérifier les breaking changes des dépendances
- [ ] Mettre à jour les docs
- [ ] Archiver les anciens logs

### Database

- [ ] Faire une sauvegarde complète
  ```bash
  # MySQL
  mysqldump -u user -p database > backup_$(date +%Y%m%d).sql
  ```

- [ ] Vérifier l'intégrité de la BD
- [ ] Analyser les query lentes
  ```sql
  SELECT * FROM mysql.slow_log;
  ```

- [ ] Nettoyer les données temporaires/test
- [ ] Vérifier les indexes

### Users & Permissions

- [ ] Revoir les utilisateurs actifs
- [ ] Archiver les comptes inactifs (> 90 jours)
- [ ] Vérifier les permissions par rôle
- [ ] Nettoyer les sessions expirées

### Reports

- [ ] Générer les rapports du mois
- [ ] Vérifier les ventes par produit
- [ ] Vérifier les clients inactifs
- [ ] Vérifier les fournisseurs à évaluer

---

## 📅 Maintenance Trimestrielle

### Major Updates

- [ ] Mettre à jour les dépendances majeures
  ```bash
  npm install vue@latest
  npm test  # Tests complets après
  ```

- [ ] Vérifier les nouvelles features des dépendances
- [ ] Refactorer le code si nécessaire

### Audit de Sécurité

- [ ] Vérifier le JWT_SECRET (le changer si trop vieux)
- [ ] Vérifier les credentials Cloudinary/Mailjet
- [ ] Vérifier les CORS settings
- [ ] Vérifier les rate limiters

### Performance Optimization

- [ ] Analyser les pages lentes
- [ ] Optimiser les images
- [ ] Optimiser les queries DB
- [ ] Optimiser les bundles JS/CSS

### Documentation

- [ ] Mettre à jour le README
- [ ] Mettre à jour l'API documentation
- [ ] Mettre à jour les guides
- [ ] Documenter les changements récents

---

## 📅 Maintenance Annuelle

### System Maintenance

- [ ] Renouveler les certificats SSL (si nécessaire)
- [ ] Vérifier la capacité disque du serveur
- [ ] Vérifier les logs archivés
- [ ] Nettoyer les anciennes backups

### Planning

- [ ] Évaluer les features manquantes
- [ ] Planifier les améliorations pour l'année
- [ ] Évaluer les nouvelles technologies
- [ ] Planifier le cycle de release

### Business Review

- [ ] Analyser les KPIs (utilisateurs, transactions, etc.)
- [ ] Évaluer la satisfaction utilisateur
- [ ] Planifier les optimisations
- [ ] Évaluer la scalabilité

---

## 🚨 Checklist de Déploiement

### Avant Déploiement

- [ ] Tester tous les changements localement
  ```bash
  npm run dev
  # Tester manuellement les features
  ```

- [ ] Exécuter les tests
  ```bash
  npm run test:unit
  npm run test:e2e
  ```

- [ ] Vérifier les lints
  ```bash
  npm run lint
  ```

- [ ] Vérifier les types
  ```bash
  npm run type-check
  ```

- [ ] Vérifier les commits
  ```bash
  git log --oneline -5
  git diff origin/main..HEAD
  ```

- [ ] Mettre à jour le CHANGELOG
- [ ] Mettre à jour la version
  ```bash
  npm version patch  # ou minor, major
  ```

### Déploiement Frontend

```bash
cd frontend/Stockly

# Build
npm run build

# Vérifier la taille
ls -lh dist/

# Tester en local
npm run preview

# Déployer (Vercel, Netlify, etc.)
# Généralement automatisé via git push
```

### Déploiement Backend

```bash
cd backend

# Vérifier les env vars en production
# MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE, MYSQL_HOST
# JWT_SECRET, MAILJET_*, CLOUDINARY_*

# Déployer (généralement automatisé)
git push origin main
```

### Post-Déploiement

- [ ] Vérifier que le site est accessible
  ```bash
  curl https://your-app.com
  ```

- [ ] Tester les fonctionnalités principales
- [ ] Vérifier les logs de production
- [ ] Vérifier qu'aucune erreur 500
- [ ] Vérifier les performances
- [ ] Notifier l'équipe du déploiement

---

## 🔴 Incident Response

### Site Down

1. Vérifier l'état du serveur
   ```bash
   # SSH into backend server
   # Check uptime
   uptime
   
   # Check logs
   tail -f /var/log/app.log
   ```

2. Vérifier la database
   ```bash
   # SSH into DB server
   # Check MySQL status
   systemctl status mysql
   
   # Check connections
   mysql -u root -p -e "SHOW PROCESSLIST;"
   ```

3. Vérifier les disques
   ```bash
   df -h
   du -sh /var/log/*
   ```

4. Redémarrer si nécessaire
   ```bash
   systemctl restart node-app
   systemctl restart mysql
   ```

5. Alerter les utilisateurs

### API Error Rate Élevé

```bash
# Vérifier les logs
tail -f /var/log/api.log | grep ERROR

# Vérifier les queries lentes
mysql -u root -p -e "SELECT * FROM mysql.slow_log LIMIT 10;"

# Vérifier la mémoire
free -h
ps aux | grep node

# Redémarrer si nécessaire
systemctl restart node-app
```

### Database Down

```bash
# Vérifier le status
systemctl status mysql

# Vérifier les logs
tail -f /var/log/mysql/error.log

# Redémarrer
systemctl restart mysql

# Vérifier la réparation
mysqlcheck -u root -p --all-databases --auto-repair
```

---

## 📊 Monitoring Checklist

### Frontend Monitoring

- [ ] Vérifier les erreurs JavaScript (Sentry, LogRocket)
- [ ] Vérifier les performances (Lighthouse)
- [ ] Vérifier l'utilisation du CDN (Cloudinary)
- [ ] Vérifier la latence réseau

### Backend Monitoring

- [ ] Vérifier les erreurs d'API
- [ ] Vérifier les temps de réponse
- [ ] Vérifier la charge du serveur
- [ ] Vérifier la connection pool MySQL

### Database Monitoring

- [ ] Vérifier l'espace disque
- [ ] Vérifier les connections actives
- [ ] Vérifier les queries lentes
- [ ] Vérifier la fragmentation

---

## 📋 Documentation Checklist

Maintenir à jour:

- [ ] `README.md` - Instructions setup
- [ ] `DEVELOPMENT.md` - Guide développement
- [ ] `API_DOCUMENTATION.md` - API endpoints
- [ ] `CHANGELOG.md` - Historique des versions
- [ ] `.env.example` - Template variables
- [ ] Code comments - Pour le code complexe

---

## 🔐 Security Checklist (Mensuel)

- [ ] Vérifier les vulnérabilités des dépendances
  ```bash
  npm audit
  npm audit fix --audit-level=high
  ```

- [ ] Vérifier les JWT secrets
  ```bash
  # Vérifier qu'il est unique et sécurisé
  echo $JWT_SECRET | wc -c  # Minimum 32 chars
  ```

- [ ] Vérifier les CORS settings
- [ ] Vérifier les rate limiters
- [ ] Vérifier les logs de connexion
- [ ] Vérifier les comptes suspectés

---

## 📝 Changelog Template

Ajouter au `CHANGELOG.md`:

```markdown
## [1.0.1] - 2025-01-22

### Added
- Feature: Nouvelle export PDF

### Fixed
- Bug: Correction du filter produits
- Bug: Correction du calcul TVA

### Changed
- UI: Redesign dashboard
- Perf: Optimisation requête API produits

### Security
- Update: Dépendances de sécurité

### Deprecated
- Ancienne API v1 (use v2)
```

---

## 🎯 Performance Targets

### Frontend
- **Lighthouse Score**: > 80
- **Bundle Size**: < 500KB (gzipped)
- **Page Load Time**: < 2s
- **Time to Interactive**: < 3s

### Backend
- **API Response Time**: < 200ms (p95)
- **Database Query Time**: < 100ms (p95)
- **Error Rate**: < 0.1%
- **Uptime**: > 99.9%

### Database
- **Query Time (average)**: < 50ms
- **Slow Queries**: < 1%
- **Connections**: < 80% of max

---

## 🚀 Scaling Checklist

Si tu atteins 10k+ utilisateurs:

- [ ] Implémenter Redis pour caching
- [ ] Implémenter une queue (Bull/RabbitMQ) pour jobs
- [ ] Mettre en place une CDN (CloudFlare)
- [ ] Optimiser les database indexes
- [ ] Implémenter une API gateway (Kong)
- [ ] Implémenter load balancing
- [ ] Implémenter database replication
- [ ] Augmenter les ressources serveur

---

## 📞 Contacts d'Urgence

```
DevOps/Infrastructure: [contact]
Database Admin: [contact]
Frontend Lead: [contact]
Backend Lead: [contact]
Product Manager: [contact]
```

---

**Bonne maintenance! 🎉**
