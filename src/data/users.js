/**
 * Base de datos hardcodeada de 5 usuarios de Radar Urbano:
 * - 4 usuarios comunes (vecinos que reportan y validan)
 * - 1 moderador (controla y edita incidentes, verifica resoluciones)
 */

export const HARDCODED_USERS = [
  {
    username: 'ivan',
    password: 'ivan123',
    name: 'Ivan Escobar',
    dni: '43.123.456',
    email: 'ivan@radarurbano.ar',
    phone: '358 412-3456',
    birthdate: '2001-08-14',
    neighborhood: 'Banda Norte, Río Cuarto',
    role: 'user',
    isModerator: false,
    reactionsCount: 16,
    points: 120,
    tier: 'oro',
    avatar: '', // Sin foto por defecto -> usa iniciales
    myCoupons: [
      {
        id: 'cup-1',
        store: 'Kiosco la familia',
        discount: '15% OFF',
        code: 'RADAR-FAM-849',
        date: '08/11/2026',
        expires: 'Vence en 30 días'
      }
    ]
  },
  {
    username: 'matias',
    password: 'matias123',
    name: 'Matias Ibarra',
    dni: '42.987.654',
    email: 'matias@radarurbano.ar',
    phone: '358 456-7890',
    birthdate: '1999-11-20',
    neighborhood: 'Centro, Río Cuarto',
    role: 'user',
    isModerator: false,
    reactionsCount: 8,
    points: 70,
    tier: 'plata',
    avatar: '',
    myCoupons: []
  },
  {
    username: 'santiago',
    password: 'santiago123',
    name: 'Santiago Garay',
    dni: '44.321.987',
    email: 'santiago@radarurbano.ar',
    phone: '358 498-1122',
    birthdate: '2002-03-10',
    neighborhood: 'Alberdi, Río Cuarto',
    role: 'user',
    isModerator: false,
    reactionsCount: 4,
    points: 45,
    tier: 'bronce',
    avatar: '',
    myCoupons: []
  },
  {
    username: 'jonatan',
    password: 'jonatan123',
    name: 'Jonatan Villavicencio',
    dni: '41.654.321',
    email: 'jonatan@radarurbano.ar',
    phone: '358 477-3344',
    birthdate: '1998-05-25',
    neighborhood: 'Castelli, Río Cuarto',
    role: 'user',
    isModerator: false,
    reactionsCount: 12,
    points: 95,
    tier: 'oro',
    avatar: '',
    myCoupons: []
  },
  {
    username: 'moderador',
    password: 'moderador123',
    name: 'Moderador Río Cuarto',
    dni: '38.000.111',
    email: 'moderacion@riocuarto.gov.ar',
    phone: '358 467-1100',
    birthdate: '1990-01-01',
    neighborhood: 'Centro, Río Cuarto',
    role: 'moderator',
    isModerator: true,
    reactionsCount: 35,
    points: 500,
    tier: 'diamante',
    avatar: '',
    myCoupons: []
  }
];

/**
 * Obtiene las iniciales a partir del nombre completo
 */
export function getInitials(name) {
  if (!name || typeof name !== 'string') return 'RU';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
