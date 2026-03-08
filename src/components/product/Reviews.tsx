'use client';

import { useState } from 'react';

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  verified: boolean;
}

const sampleReviews: Review[] = [
  {
    id: '1',
    author: 'Maria Silva',
    rating: 5,
    date: '2026-01-15',
    title: 'Perfeita!',
    content: 'A garrafa é linda e mantém a água gelada o dia todo. A personalização ficou exatamente como eu queria!',
    verified: true
  },
  {
    id: '2',
    author: 'João Santos',
    rating: 5,
    date: '2026-01-10',
    title: 'Qualidade excepcional',
    content: 'Comprei para presentear e foi um sucesso. Material de primeira, impressão perfeita.',
    verified: true
  },
  {
    id: '3',
    author: 'Ana Costa',
    rating: 4,
    date: '2026-01-05',
    title: 'Muito boa',
    content: 'Adorei a garrafa! Só achei que poderia ter mais opções de cores.',
    verified: true
  }
];

interface ReviewsProps {
  productId?: string;
}

export function Reviews({ productId }: ReviewsProps) {
  const [reviews] = useState<Review[]>(sampleReviews);
  const [showForm, setShowForm] = useState(false);

  const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
  const ratingCounts = [5, 4, 3, 2, 1].map(rating => 
    reviews.filter(r => r.rating === rating).length
  );

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black mb-2">Avaliações dos Clientes</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-black">{averageRating.toFixed(1)}</span>
                <div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className={star <= averageRating ? 'text-yellow-400' : 'text-gray-300'}>
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">{reviews.length} avaliações</p>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-brand-pink text-white rounded-full font-bold hover:opacity-90 transition"
          >
            Escrever Avaliação
          </button>
        </div>

        {/* Rating Distribution */}
        <div className="mb-8 p-6 bg-gray-50 rounded-lg">
          {[5, 4, 3, 2, 1].map((rating, index) => (
            <div key={rating} className="flex items-center gap-4 mb-2 last:mb-0">
              <span className="text-sm font-medium w-12">{rating} ★</span>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-400"
                  style={{ width: `${(ratingCounts[index] / reviews.length) * 100}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 w-12 text-right">{ratingCounts[index]}</span>
            </div>
          ))}
        </div>

        {/* Review Form */}
        {showForm && (
          <div className="mb-8 p-6 bg-white border-2 border-brand-pink rounded-lg">
            <h3 className="text-lg font-bold mb-4">Escreva sua avaliação</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nota</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="text-3xl text-gray-300 hover:text-yellow-400 transition"
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Título</label>
                <input
                  type="text"
                  placeholder="Resuma sua experiência"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Avaliação</label>
                <textarea
                  rows={4}
                  placeholder="Conte-nos sobre sua experiência com o produto"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-brand-pink text-white rounded-full font-bold hover:opacity-90 transition"
                >
                  Publicar Avaliação
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-bold hover:bg-gray-300 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold">{review.author}</span>
                    {review.verified && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        ✓ Compra Verificada
                      </span>
                    )}
                  </div>
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className={star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(review.date).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <h4 className="font-bold mb-2">{review.title}</h4>
              <p className="text-gray-700">{review.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
