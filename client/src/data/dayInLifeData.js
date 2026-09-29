// Data for the Explore page's "A Day in the Life" nostalgic journey.
// image: null renders a styled placeholder in DaySegment.

export const personalities = [
  {
    id: 'cartoon',
    emoji: '📺',
    label: 'THE CARTOON KID',
    tagline: "Your day wasn't complete without after-school cartoons.",
    priority: ['Cartoons', 'TV', 'Games', 'School'],
  },
  {
    id: 'gamer',
    emoji: '🎮',
    label: 'THE GAMER',
    tagline: 'Vice City, NFS and countless hours in front of the TV.',
    priority: ['Games', 'Cartoons', 'Gadgets', 'TV'],
  },
  {
    id: 'outdoor',
    emoji: '🏏',
    label: 'THE OUTDOOR KID',
    tagline: 'Cricket, cycling, hide & seek and coming home only when called.',
    priority: ['Outdoor', 'School', 'Snacks', 'Cartoons'],
  },
  {
    id: 'school',
    emoji: '📚',
    label: 'THE SCHOOL KID',
    tagline: 'Friends, lunch breaks, notebooks and unforgettable school memories.',
    priority: ['School', 'Friends', 'Snacks', 'Cartoons'],
  },
  {
    id: 'tv',
    emoji: '🍿',
    label: 'THE TV KID',
    tagline: 'One television. One remote. Everyone fighting over what to watch.',
    priority: ['TV', 'Cartoons', 'Movies', 'Games'],
  },
];

// Only the 2000s day-in-life is fully built out for now.
export const dayTimeline2000s = [
  {
    id: 'morning',
    emoji: '🌅',
    time: '7:00 AM',
    heading: 'SCHOOL MORNING',
    subtitle: 'Wake up, get ready, grab your school bag and somehow find time for breakfast.',
    category: 'School',
    type: 'items',
    items: [
      { emoji: '🎒', label: 'School Bag' },
      { emoji: '✏️', label: 'Natraj / Apsara Pencils' },
      { emoji: '📚', label: 'School Notebooks' },
      { emoji: '🍫', label: 'School Snacks' },
    ],
  },
  {
    id: 'recess',
    emoji: '🏫',
    time: '12:30 PM',
    heading: 'THE BEST 20 MINUTES OF THE DAY',
    subtitle: 'Friends, lunch boxes, trading snacks and trying to finish everything before the bell.',
    category: 'School',
    type: 'items',
    items: [
      { emoji: '🍱', label: 'Lunch Box' },
      { emoji: '🍬', label: 'Childhood Snacks' },
      { emoji: '🏏', label: 'Recess Games' },
      { emoji: '👬', label: 'Best Friends' },
    ],
  },
  {
    id: 'cartoons',
    emoji: '📺',
    time: '4:00 PM',
    heading: 'THE MOST IMPORTANT PART OF THE DAY',
    subtitle: 'School is over. Bag is thrown somewhere. TV is ON.',
    category: 'Cartoons',
    type: 'media',
    big: true,
    media: [
      {
        title: 'Doraemon',
        tagline: 'Coming home just in time for your favorite episode.',
        image: '/images/2000s/Cartoons/doremon.jpg',
      },
      {
        title: 'Shinchan',
        tagline: 'Racing home before the theme song even ended.',
        image: '/images/2000s/Cartoons/shinchan.jpg',
      },
      {
        title: 'Pokémon',
        tagline: 'Believing you too could become a Pokémon Master.',
        image: '/images/2000s/Cartoons/pokemon.jpg',
      },
      {
        title: 'Tom and Jerry',
        tagline: 'The chase that never got old, rerun after rerun.',
        image: '/images/2000s/Cartoons/Tomandjerry.jpeg',
      },
    ],
  },
  {
    id: 'playtime',
    emoji: '🎮',
    time: '6:00 PM',
    heading: 'BEFORE ONLINE MULTIPLAYER',
    subtitle: 'Gaming meant sharing one screen, waiting for your turn and memorizing cheat codes.',
    category: 'Games',
    type: 'media',
    media: [
      {
        title: 'GTA Vice City',
        tagline: 'Neon lights, radio stations, and endless side missions.',
        image: '/images/2000s/Games/gtavc.jpg',
      },
      {
        title: 'GTA San Andreas',
        tagline: 'Passing the controller around after every failed mission.',
        image: '/images/2000s/Games/gtasa.jpg',
      },
      {
        title: 'Need for Speed Hot Pursuit',
        tagline: "Memorizing shortcuts just to beat your friend's time.",
        image: '/images/2000s/Games/nfshp.jpg',
      },
      {
        title: 'Prince of Persia',
        tagline: 'Timing every jump like your life depended on it.',
        image: '/images/2000s/Games/prince of persia.jpg',
      },
    ],
  },
  {
    id: 'familytv',
    emoji: '📺',
    time: '8:00 PM',
    heading: 'ONE TV. ONE REMOTE. EVERYONE HAD AN OPINION.',
    subtitle: 'The whole family, one screen, and a nightly negotiation over the remote.',
    category: 'TV',
    type: 'media',
    media: [
      { title: 'CID', tagline: 'ACP Pradyuman about to crack the case, again.', image: null },
      {
        title: 'Taarak Mehta Ka Ooltah Chashmah',
        tagline: 'Gokuldham Society and its never-ending drama.',
        image: null,
      },
      { title: 'Shararat', tagline: 'Wishing you had a magical family of your own.', image: null },
      { title: 'FIR', tagline: 'Chaos at the police station, every single episode.', image: null },
      {
        title: "Takeshi's Castle",
        tagline: 'The dubbed commentary made it ten times funnier.',
        image: null,
      },
    ],
  },
  {
    id: 'bedtime',
    emoji: '🌙',
    time: '10:00 PM',
    heading: 'JUST ONE MORE EPISODE...',
    subtitle: 'And then came the classic excuse: "Bas 5 minute aur."',
    category: 'Cartoons',
    type: 'items',
    items: [
      { emoji: '📖', label: 'Story Books' },
      { emoji: '🎵', label: 'Old Songs' },
      { emoji: '🧸', label: 'Childhood Toys' },
      { emoji: '📺', label: 'One Last Cartoon' },
    ],
  },
];

export const memoryMoments = [
  'Coming home from school, dropping your bag, and turning on the TV before even changing clothes.',
  'Racing your friends on cycles till the streetlights came on and someone had to go home.',
  'Trading snacks from the tiffin box and somehow never eating your own lunch.',
  'Rewinding a cassette or VHS tape just to watch your favorite scene one more time.',
  "The sound of your mother calling you home for dinner while you were mid-match outside.",
  'Fighting with your siblings over who gets to hold the remote tonight.',
];
