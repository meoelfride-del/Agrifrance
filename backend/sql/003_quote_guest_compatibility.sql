-- Les demandes de devis invitées ne possèdent pas encore de compte utilisateur.
-- Cette correction reste idempotente pour les bases créées par d'anciennes versions.
ALTER TABLE quotes ALTER COLUMN user_id DROP NOT NULL;
