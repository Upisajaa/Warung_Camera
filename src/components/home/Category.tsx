import {
  Camera,
  Radio,
  Plane,
  Aperture,
  Cable
} from 'lucide-react';

const categories = [
  { name: 'DSLR', icon: Camera },
  { name: 'Mirrorless', icon: Camera },
  { name: 'Action Cam', icon: Radio },
  { name: 'Drone', icon: Plane },
  { name: 'Lensa', icon: Aperture },
  { name: 'Aksesoris', icon: Cable },
];

export default function Categories() {
  return (
    <section className="max-w-7xl mx-auto px-6 mt-16">
      <h2 className="text-4xl font-bold mb-10">
        Kategori Populer
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {categories.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="bg-white rounded-3xl p-8 shadow hover:shadow-xl transition-all cursor-pointer text-center"
            >
              <Icon size={42} className="mx-auto mb-4" />

              <h3 className="font-semibold text-lg">
                {item.name}
              </h3>
            </div>
          );
        })}
      </div>
    </section>
  );
}