
import React from 'react';
import { Link } from 'react-router-dom';
import { Monitor, Shield, BarChart3, Users, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const Home = () => {
  const features = [
    {
      icon: Monitor,
      title: 'Gestion du Matériel',
      description: 'Suivi complet de tous vos équipements informatiques avec historique détaillé'
    },
    {
      icon: Users,
      title: 'Attribution Simplifiée',
      description: 'Assignez facilement le matériel aux utilisateurs et gardez une trace des responsabilités'
    },
    {
      icon: BarChart3,
      title: 'Analyses Avancées',
      description: 'Tableaux de bord intuitifs pour visualiser les performances de votre parc informatique'
    },
    {
      icon: Shield,
      title: 'Sécurité Renforcée',
      description: 'Contrôle d\'accès granulaire et audit complet de toutes les opérations'
    }
  ];

  const benefits = [
    'Réduction des coûts de maintenance',
    'Amélioration de la productivité',
    'Conformité réglementaire',
    'Optimisation des ressources',
    'Traçabilité complète',
    'Interface intuitive'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Monitor className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AssetTracker</h1>
                <p className="text-sm text-gray-500">Gestion de matériel professionnel</p>
              </div>
            </div>
            <Link to="/login">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Se connecter
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section avec images */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Gérez votre parc informatique
                <span className="text-blue-600"> en toute simplicité</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                AssetTracker vous offre une solution complète pour le suivi, la gestion et l'optimisation 
                de tous vos équipements informatiques. Simplifiez vos processus et gagnez en efficacité.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/login">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
                    Commencer maintenant
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                  Voir la démo
                </Button>
              </div>
            </div>
            
            {/* Section d'images */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <img 
                    src="/images/espace-de-travail-a-ecran-vide-avec-ordinateur-portable-sur-la-table-la-nuit-espace-de-copie.jpg"
                    alt="Ordinateur portable moderne"
                    className="w-full h-48 object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                  />
                  <img 
                    src="/images/femmepc.jpg"
                    alt="Femme travaillant sur ordinateur"
                    className="w-full h-32 object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                  />
                </div>
                <div className="space-y-4 mt-8">
                  <img 
                    src="/images/1.jpg"
                    alt="Espace de travail moderne"
                    className="w-full h-32 object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                  />
                  <img 
                    src="/images/espace_travail_bureau.jpg"
                    alt="Bureau moderne avec équipements"
                    className="w-full h-48 object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                  />
                </div>
              </div>
              
              {/* Éléments décoratifs */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-purple-500 rounded-full opacity-10 animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Fonctionnalités Principales
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Découvrez les outils puissants qui vous aideront à optimiser la gestion de votre matériel informatique
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <feature.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Pourquoi choisir AssetTracker ?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Notre solution vous permet de centraliser la gestion de votre parc informatique 
                tout en optimisant vos coûts et en améliorant votre productivité.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-lg shadow-2xl p-8">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Tableau de bord en temps réel</h3>
                      <p className="text-sm text-gray-500">Visualisez vos données instantanément</p>
                    </div>
                  </div>
                  <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg opacity-20"></div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">250+</div>
                      <div className="text-sm text-gray-500">Équipements</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">98%</div>
                      <div className="text-sm text-gray-500">Disponibilité</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">45</div>
                      <div className="text-sm text-gray-500">Utilisateurs</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Prêt à optimiser votre gestion informatique ?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Rejoignez des centaines d'entreprises qui font confiance à AssetTracker 
            pour gérer leur parc informatique efficacement.
          </p>
          <Link to="/login">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Commencer gratuitement
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Monitor className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">AssetTracker</span>
              </div>
              <p className="text-gray-400 max-w-md">
                Solution professionnelle pour la gestion complète de votre parc informatique. 
                Simplifiez vos processus et optimisez vos ressources.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Solutions</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Gestion d'actifs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Maintenance</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Rapports</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Aide</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 AssetTracker. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
