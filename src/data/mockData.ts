export type Sport = 'tennis' | 'padel' | 'pingpong' | 'squash' | 'badminton';

export interface User {
  id: string;
  pseudo: string;
  avatar?: string;
  sports: Sport[];
  club?: string;
  matchCount: number;
  followingCount: number;
  followersCount: number;
  isFollowing?: boolean;
}

export interface MatchSet {
  set: number;
  scoreA: number;
  scoreB: number;
}

export interface MomentFort {
  id: string;
  timestamp: number; // seconds into video
  label: string;
  youtubeUrl: string;
}

export interface Match {
  id: string;
  sport: Sport;
  club: string;
  court: string;
  date: string;
  duration: string;
  playersA: User[];
  playersB: User[];
  sets: MatchSet[];
  finalScore: string;
  youtubeVideoId: string;
  thumbnailUrl: string;
  isLive?: boolean;
  momentsFortsCount: number;
  momentsForts?: MomentFort[];
  postId?: string;
  winner?: 'A' | 'B';
}

export interface Post {
  id: string;
  type: 'match' | 'photo' | 'moment_fort';
  author: User;
  match?: Match;
  photoUrl?: string;
  caption?: string;
  moment?: MomentFort;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  createdAt: string;
  taggedUsers?: User[];
}

export interface Comment {
  id: string;
  author: User;
  text: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: 'live' | 'moment_fort' | 'follower' | 'like' | 'comment' | 'replay';
  fromUser?: User;
  match?: Match;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// --- Mock Users ---
export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    pseudo: 'RaphaelDupont',
    sports: ['padel', 'tennis'],
    club: 'Club du Lac Paris 15',
    matchCount: 47,
    followingCount: 23,
    followersCount: 156,
    isFollowing: false,
  },
  {
    id: 'u2',
    pseudo: 'SofiaM',
    sports: ['padel'],
    club: 'Padel Factory Lyon',
    matchCount: 31,
    followingCount: 18,
    followersCount: 89,
    isFollowing: true,
  },
  {
    id: 'u3',
    pseudo: 'MaxBouleau',
    sports: ['tennis', 'squash'],
    club: 'Club du Lac Paris 15',
    matchCount: 62,
    followingCount: 41,
    followersCount: 230,
    isFollowing: true,
  },
  {
    id: 'u4',
    pseudo: 'LucasV',
    sports: ['pingpong'],
    club: 'TT Vincennes',
    matchCount: 15,
    followingCount: 8,
    followersCount: 34,
    isFollowing: false,
  },
  {
    id: 'u5',
    pseudo: 'ChloeR',
    sports: ['padel', 'badminton'],
    club: 'Padel Factory Lyon',
    matchCount: 28,
    followingCount: 15,
    followersCount: 72,
    isFollowing: true,
  },
  {
    id: 'me',
    pseudo: 'AlexSport',
    sports: ['padel', 'tennis'],
    club: 'Club du Lac Paris 15',
    matchCount: 24,
    followingCount: 12,
    followersCount: 48,
  },
];

export const ME = MOCK_USERS.find(u => u.id === 'me')!;

// --- Mock Matches ---
export const MOCK_MATCHES: Match[] = [
  {
    id: 'm1',
    sport: 'padel',
    club: 'Club du Lac Paris 15',
    court: 'Terrain 2',
    date: '2026-02-25T18:30:00',
    duration: '1h 12min',
    playersA: [MOCK_USERS[0], MOCK_USERS[2]],
    playersB: [MOCK_USERS[1], MOCK_USERS[4]],
    sets: [
      { set: 1, scoreA: 6, scoreB: 4 },
      { set: 2, scoreA: 7, scoreB: 5 },
    ],
    finalScore: '6-4 7-5',
    youtubeVideoId: 'dQw4w9WgXcQ',
    thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    isLive: true,
    momentsFortsCount: 3,
    momentsForts: [
      { id: 'mf1', timestamp: 342, label: 'Smash imparable !', youtubeUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ&t=342' },
      { id: 'mf2', timestamp: 1204, label: 'Échange de 20 coups', youtubeUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ&t=1204' },
      { id: 'mf3', timestamp: 2891, label: 'Balle de match !', youtubeUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ&t=2891' },
    ],
    winner: 'A',
  },
  {
    id: 'm2',
    sport: 'tennis',
    club: 'Club du Lac Paris 15',
    court: 'Court Central',
    date: '2026-02-24T10:00:00',
    duration: '2h 05min',
    playersA: [MOCK_USERS[2]],
    playersB: [MOCK_USERS[0]],
    sets: [
      { set: 1, scoreA: 6, scoreB: 3 },
      { set: 2, scoreA: 4, scoreB: 6 },
      { set: 3, scoreA: 6, scoreB: 4 },
    ],
    finalScore: '6-3 4-6 6-4',
    youtubeVideoId: 'dQw4w9WgXcQ',
    thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    momentsFortsCount: 5,
    winner: 'A',
  },
  {
    id: 'm3',
    sport: 'padel',
    club: 'Padel Factory Lyon',
    court: 'Terrain 1',
    date: '2026-02-23T19:00:00',
    duration: '58min',
    playersA: [MOCK_USERS[1], MOCK_USERS[4]],
    playersB: [MOCK_USERS[0], MOCK_USERS[2]],
    sets: [
      { set: 1, scoreA: 6, scoreB: 2 },
      { set: 2, scoreA: 6, scoreB: 3 },
    ],
    finalScore: '6-2 6-3',
    youtubeVideoId: 'dQw4w9WgXcQ',
    thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    momentsFortsCount: 2,
    winner: 'A',
  },
  {
    id: 'm4',
    sport: 'squash',
    club: 'Club du Lac Paris 15',
    court: 'Box 3',
    date: '2026-02-22T12:30:00',
    duration: '45min',
    playersA: [MOCK_USERS[5]],
    playersB: [MOCK_USERS[2]],
    sets: [
      { set: 1, scoreA: 11, scoreB: 8 },
      { set: 2, scoreA: 9, scoreB: 11 },
      { set: 3, scoreA: 11, scoreB: 7 },
    ],
    finalScore: '11-8 9-11 11-7',
    youtubeVideoId: 'dQw4w9WgXcQ',
    thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    momentsFortsCount: 1,
    winner: 'A',
  },
];

// --- Mock Posts ---
export const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    type: 'match',
    author: MOCK_USERS[0],
    match: MOCK_MATCHES[0],
    likesCount: 24,
    commentsCount: 8,
    isLiked: false,
    createdAt: '2026-02-25T18:30:00',
  },
  {
    id: 'p2',
    type: 'moment_fort',
    author: MOCK_USERS[2],
    match: MOCK_MATCHES[1],
    moment: MOCK_MATCHES[0].momentsForts?.[0],
    likesCount: 41,
    commentsCount: 5,
    isLiked: true,
    createdAt: '2026-02-24T11:15:00',
  },
  {
    id: 'p3',
    type: 'match',
    author: MOCK_USERS[2],
    match: MOCK_MATCHES[1],
    likesCount: 18,
    commentsCount: 3,
    isLiked: false,
    createdAt: '2026-02-24T12:30:00',
  },
  {
    id: 'p4',
    type: 'photo',
    author: MOCK_USERS[1],
    photoUrl: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400',
    caption: 'Super session de padel aujourd\'hui avec les copains ! 🎾',
    taggedUsers: [MOCK_USERS[4]],
    likesCount: 67,
    commentsCount: 12,
    isLiked: true,
    createdAt: '2026-02-23T20:00:00',
  },
  {
    id: 'p5',
    type: 'match',
    author: MOCK_USERS[1],
    match: MOCK_MATCHES[2],
    likesCount: 9,
    commentsCount: 1,
    isLiked: false,
    createdAt: '2026-02-23T21:00:00',
  },
];

export const MOCK_COMMENTS: Comment[] = [
  {
    id: 'c1',
    author: MOCK_USERS[2],
    text: 'Quel match incroyable ! Ce smash en fin de 2ème set 🔥',
    createdAt: '2026-02-25T19:00:00',
  },
  {
    id: 'c2',
    author: MOCK_USERS[4],
    text: 'GG les gars, revanche bientôt !',
    createdAt: '2026-02-25T19:15:00',
  },
  {
    id: 'c3',
    author: MOCK_USERS[3],
    text: 'Top niveau 👏',
    createdAt: '2026-02-25T20:00:00',
  },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'live',
    fromUser: MOCK_USERS[0],
    match: MOCK_MATCHES[0],
    message: 'RaphaelDupont vient de commencer un match à Club du Lac Paris 15',
    isRead: false,
    createdAt: '2026-02-25T18:31:00',
  },
  {
    id: 'n2',
    type: 'moment_fort',
    fromUser: MOCK_USERS[2],
    match: MOCK_MATCHES[0],
    message: 'MaxBouleau a marqué un point de ouf !',
    isRead: false,
    createdAt: '2026-02-25T18:45:00',
  },
  {
    id: 'n3',
    type: 'like',
    fromUser: MOCK_USERS[1],
    message: 'SofiaM a aimé votre match',
    isRead: false,
    createdAt: '2026-02-25T14:20:00',
  },
  {
    id: 'n4',
    type: 'comment',
    fromUser: MOCK_USERS[2],
    message: 'MaxBouleau a commenté : "Quel match incroyable !"',
    isRead: true,
    createdAt: '2026-02-24T19:00:00',
  },
  {
    id: 'n5',
    type: 'follower',
    fromUser: MOCK_USERS[3],
    message: 'LucasV vous suit maintenant',
    isRead: true,
    createdAt: '2026-02-24T11:00:00',
  },
  {
    id: 'n6',
    type: 'replay',
    message: 'Votre match du 22 février est disponible en replay',
    isRead: true,
    createdAt: '2026-02-22T14:00:00',
  },
];

export const SPORT_LABELS: Record<Sport, string> = {
  tennis: 'Tennis',
  padel: 'Padel',
  pingpong: 'Ping-Pong',
  squash: 'Squash',
  badminton: 'Badminton',
};

export const SPORT_ICONS: Record<Sport, string> = {
  tennis: '🎾',
  padel: '🏓',
  pingpong: '🏓',
  squash: '🟡',
  badminton: '🏸',
};

export function formatRelativeTime(dateString: string): string {
  const now = new Date('2026-02-25T21:00:00');
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'à l\'instant';
  if (diffMin < 60) return `il y a ${diffMin}min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `il y a ${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  if (diffD === 1) return 'hier';
  return `il y a ${diffD}j`;
}

export function formatMatchDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function formatMatchTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}
