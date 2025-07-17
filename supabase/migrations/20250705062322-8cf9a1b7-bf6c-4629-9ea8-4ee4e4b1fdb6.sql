
-- Insert test data into the database

-- 1. Insert test users
INSERT INTO public.utilisateurs (nom, prenom, email, telephone, service, poste) VALUES
('Dupont', 'Jean', 'jean.dupont@entreprise.com', '01.23.45.67.89', 'Informatique', 'Administrateur système'),
('Martin', 'Marie', 'marie.martin@entreprise.com', '01.23.45.67.90', 'Comptabilité', 'Comptable'),
('Bernard', 'Pierre', 'pierre.bernard@entreprise.com', '01.23.45.67.91', 'RH', 'Responsable RH'),
('Dubois', 'Sophie', 'sophie.dubois@entreprise.com', '01.23.45.67.92', 'Commercial', 'Commerciale'),
('Moreau', 'Luc', 'luc.moreau@entreprise.com', '01.23.45.67.93', 'Direction', 'Directeur');

-- 2. Insert test equipment
INSERT INTO public.materiel (nom, modele, numero_serie, fournisseur, date_achat, prix_achat, garantie_fin, description, statut) VALUES
('PC Portable Dell', 'Latitude 7420', 'DL7420001', 'Dell Technologies', '2023-01-15', 1200.00, '2026-01-15', 'Ordinateur portable pour le travail bureautique', 'Disponible'),
('PC Portable HP', 'EliteBook 840', 'HP840002', 'HP Inc.', '2023-02-20', 1350.00, '2026-02-20', 'Ordinateur portable haute performance', 'Attribué'),
('Écran Samsung', '27" 4K', 'SM27K003', 'Samsung', '2023-03-10', 450.00, '2025-03-10', 'Écran 27 pouces Ultra HD', 'Disponible'),
('Imprimante Canon', 'PIXMA TR8550', 'CN8550004', 'Canon', '2023-01-25', 180.00, '2024-01-25', 'Imprimante multifonction couleur', 'En maintenance'),
('Serveur HPE', 'ProLiant DL380', 'HPE380005', 'HPE', '2022-12-01', 3500.00, '2025-12-01', 'Serveur de production', 'Disponible'),
('Switch Cisco', 'Catalyst 2960', 'CS2960006', 'Cisco', '2023-04-05', 800.00, '2026-04-05', 'Switch réseau 24 ports', 'Disponible'),
('Téléphone IP', 'Yealink T46S', 'YL46S007', 'Yealink', '2023-02-15', 120.00, '2025-02-15', 'Téléphone IP professionnel', 'Attribué'),
('Tablette iPad', 'Air 5e génération', 'IP5G008', 'Apple', '2023-05-20', 750.00, '2024-05-20', 'Tablette pour présentations', 'Disponible');

-- 3. Insert test attributions
INSERT INTO public.attributions (materiel_id, utilisateur_id, date_attribution, notes, statut) VALUES
((SELECT id FROM materiel WHERE numero_serie = 'HP840002'), (SELECT id FROM utilisateurs WHERE email = 'jean.dupont@entreprise.com'), '2023-03-01', 'Attribution pour poste de travail principal', 'Actif'),
((SELECT id FROM materiel WHERE numero_serie = 'YL46S007'), (SELECT id FROM utilisateurs WHERE email = 'marie.martin@entreprise.com'), '2023-03-15', 'Téléphone pour bureau comptabilité', 'Actif');

-- 4. Insert test maintenance records
INSERT INTO public.maintenance (materiel_id, type_maintenance, probleme, technicien, date_debut, date_fin, cout, notes, statut) VALUES
((SELECT id FROM materiel WHERE numero_serie = 'CN8550004'), 'Réparation', 'Bourrage papier récurrent', 'Service Technique', '2023-06-01', '2023-06-03', 85.00, 'Remplacement du module d''alimentation papier', 'Terminé'),
((SELECT id FROM materiel WHERE numero_serie = 'HPE380005'), 'Maintenance préventive', 'Maintenance trimestrielle programmée', 'Jean Dupont', '2023-06-15', NULL, NULL, 'Vérification système et mise à jour firmware', 'En cours');

-- 5. Insert test incidents
INSERT INTO public.incidents (materiel_id, utilisateur_id, titre, description, priorite, statut, date_creation) VALUES
((SELECT id FROM materiel WHERE numero_serie = 'HP840002'), (SELECT id FROM utilisateurs WHERE email = 'jean.dupont@entreprise.com'), 'Écran bleu au démarrage', 'L''ordinateur affiche un écran bleu au démarrage depuis ce matin', 'Haute', 'Ouvert', '2023-06-10 09:30:00'),
((SELECT id FROM materiel WHERE numero_serie = 'CS2960006'), (SELECT id FROM utilisateurs WHERE email = 'pierre.bernard@entreprise.com'), 'Perte de connexion réseau', 'Connexions intermittentes sur le réseau', 'Moyenne', 'En cours', '2023-06-08 14:15:00'),
((SELECT id FROM materiel WHERE numero_serie = 'YL46S007'), (SELECT id FROM utilisateurs WHERE email = 'marie.martin@entreprise.com'), 'Problème audio', 'Le micro ne fonctionne plus correctement', 'Basse', 'Résolu', '2023-06-05 11:00:00');
