import { Link } from 'react-router-dom';
import { Compass, Briefcase, Calendar, Tag } from 'lucide-react';

export function HomePage() {
  const features = [
    {
      icon: <Compass className="w-12 h-12 text-blue-600" />,
      title: 'Découverte',
      description: 'Explorez les meilleurs endroits de Brest',
      link: '/decouverte'
    },
    {
      icon: <Briefcase className="w-12 h-12 text-green-600" />,
      title: 'Offres emplois',
      description: 'Trouvez votre prochain emploi ou stage',
      link: '/emplois'
    },
    {
      icon: <Calendar className="w-12 h-12 text-purple-600" />,
      title: 'Événements',
      description: 'Ne manquez aucun événement important',
      link: '/evenements'
    },
    {
      icon: <Tag className="w-12 h-12 text-red-600" />,
      title: 'Bon plans',
      description: 'Profitez des meilleures offres étudiantes',
      link: '/bons-plans'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[400px] mb-12">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1570438395701-aee966d0e8bc?auto=format&fit=crop&q=80"
            alt="Brest"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Bienvenue sur BrestLife
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Votre guide complet pour vivre et étudier à Brest
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
        {features.map((feature) => (
          <Link
            key={feature.title}
            to={feature.link}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex flex-col items-center text-center">
              {feature.icon}
              <h2 className="text-xl font-semibold mt-4 mb-2">{feature.title}</h2>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          </Link>
        ))}
      </section>

      {/* Quick Access Section */}
      <section className="mt-16 bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-semibold mb-6">Accès rapide</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 border rounded-lg hover:bg-gray-50">
            <h3 className="font-semibold mb-2">Transport</h3>
            <p className="text-gray-600">Horaires des bus et tramways en temps réel</p>
          </div>
          <div className="p-4 border rounded-lg hover:bg-gray-50">
            <h3 className="font-semibold mb-2">Restauration</h3>
            <p className="text-gray-600">Menus des restaurants universitaires</p>
          </div>
          <div className="p-4 border rounded-lg hover:bg-gray-50">
            <h3 className="font-semibold mb-2">Actualités</h3>
            <p className="text-gray-600">Dernières nouvelles de la vie étudiante</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;