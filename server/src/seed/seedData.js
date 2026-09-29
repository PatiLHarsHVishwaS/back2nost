import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { User } from '../models/User.js';
import { Community } from '../models/Community.js';
import { Post } from '../models/Post.js';
import { Comment } from '../models/Comment.js';
import { Message } from '../models/Message.js';
import { connectDB } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const demoUsersData = [
  {
    username: 'Rohan',
    email: 'rohan@nostalgia.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    bio: 'Born in the right era ❤️ Beyblade tournament champion in 5th grade.',
    eraPreference: '2000s',
    interests: ['Cartoons', 'Toys', 'Games'],
  },
  {
    username: 'Sneha',
    email: 'sneha@nostalgia.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    bio: '4 PM Cartoon Network was non-negotiable. Still craving Cadbury Bytes.',
    eraPreference: '2000s',
    interests: ['Cartoons', 'Snacks', 'School'],
  },
  {
    username: 'Aditya',
    email: 'aditya@nostalgia.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    bio: 'Road Rash with cheats was pure joy. PS2 memory cards were my treasure.',
    eraPreference: '2000s',
    interests: ['Games', 'Gadgets', 'Cars'],
  },
  {
    username: 'Karan',
    email: 'karan@nostalgia.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    bio: 'Nokia 1100 Snake high score holder. Cassette rewind with Reynolds pen master.',
    eraPreference: '90s',
    interests: ['Gadgets', 'Music', 'School'],
  },
  {
    username: 'Meera',
    email: 'meera@nostalgia.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
    bio: 'Waiting all week for Sunday Morning Shaktimaan and Disney Hour on DD.',
    eraPreference: '90s',
    interests: ['Cartoons', 'Movies', 'Comics'],
  },
  {
    username: 'Rahul',
    email: 'rahul@nostalgia.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    bio: 'Maruti 800 road trips with Antakshari on tape recorder.',
    eraPreference: '2000s',
    interests: ['Cars', 'Music', 'School'],
  },
  {
    username: 'Aditi',
    email: 'aditi@nostalgia.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    bio: 'Collector of Boomer stickers and Cheetos Pokémon Tazos. Trading lunch was an art.',
    eraPreference: '2000s',
    interests: ['Snacks', 'Toys', 'Cartoons'],
  },
  {
    username: 'Neha',
    email: 'neha@nostalgia.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    bio: 'Natraj geometric compass box battles and scented erasers.',
    eraPreference: '90s',
    interests: ['School', 'Clothes', 'Snacks'],
  },
  {
    username: 'Arjun',
    email: 'arjun@nostalgia.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    bio: 'Cyber cafe Counter Strike 1.6 and GTA Vice City LAN parties.',
    eraPreference: '2000s',
    interests: ['Games', 'Gadgets', 'Comics'],
  },
  {
    username: 'Sakshi',
    email: 'sakshi@nostalgia.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
    bio: 'Shaka Laka Boom Boom magic pencil believer. 90s indie pop fanatic.',
    eraPreference: '90s',
    interests: ['Music', 'Cartoons', 'Clothes'],
  },
];

const communitiesData = [
  {
    name: 'r/IndianCartoons',
    slug: 'indiancartoons',
    displayName: 'Indian Cartoons & Anime',
    description: 'Relive 5 PM Cartoon Network, Hungama, Jetix, Animax and classic Hindi dubs of Doraemon, Shinchan, Beyblade, and Pokémon!',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=300&q=80',
    banner: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
    category: 'Cartoons',
    channels: [
      { id: 'general', name: 'general', topic: 'Chat about all childhood cartoons' },
      { id: 'doraemon', name: 'doraemon', topic: 'Anywhere Door, Bamboo Copter & Nobita vibes' },
      { id: 'shinchan', name: 'shinchan', topic: 'Buri Buri Zaemon and Kasukabe defense force' },
      { id: 'pokemon', name: 'pokemon', topic: 'Gotta catch em all - Indigo League nostalgia' },
      { id: 'memes', name: 'memes', topic: 'Cartoon Network memes and funny dubs' },
      { id: 'memories', name: 'memories', topic: 'Coming home from school at 4:30 PM' },
    ],
  },
  {
    name: 'r/ChildhoodSnacks',
    slug: 'childhoodsnacks',
    displayName: 'Childhood Snacks & Candies',
    description: 'Phantom cigarettes, Cadbury Bytes, Mango Bite, Boomer, Parle-G with chai, Crax rings, and 1 rupee ice pops.',
    image: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&w=300&q=80',
    banner: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    category: 'Snacks',
    channels: [
      { id: 'general', name: 'general', topic: 'Favorite snacks from 90s & 2000s' },
      { id: 'candy-wars', name: 'candy-wars', topic: 'Mango Bite vs Kismi vs Poppins debate' },
      { id: '90s-snacks', name: '90s-snacks', topic: 'The snacks that disappeared too soon' },
      { id: 'school-canteen', name: 'school-canteen', topic: 'What ₹5 bought you during recess' },
    ],
  },
  {
    name: 'r/RetroGaming',
    slug: 'retrogaming',
    displayName: 'Retro Gaming & Consoles',
    description: 'Road Rash, GTA Vice City, Dangerous Dave, Contra 30 lives, Duck Hunt 8-bit cassettes, and PS2 FIFA matches.',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=300&q=80',
    banner: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
    category: 'Games',
    channels: [
      { id: 'general', name: 'general', topic: 'Classic PC and console memories' },
      { id: 'pc-classics', name: 'pc-classics', topic: 'Road Rash, Midtown Madness & Dave' },
      { id: 'ps2-era', name: 'ps2-era', topic: 'PS2 chips, GTA Vice City & San Andreas' },
      { id: 'handhelds', name: 'handhelds', topic: 'Game Boy Color, Brick Game 9999 in 1' },
      { id: 'cheats', name: 'cheats', topic: 'LEAVEMEALONE, ASPIRINE, HESOYAM' },
    ],
  },
  {
    name: 'r/OldToys',
    slug: 'oldtoys',
    displayName: 'Vintage Toys & Collectibles',
    description: 'Driger vs Dragoon Beyblades, Pokémon Tazos from Cheetos, Hot Wheels loops, WWE trump cards, and laser pointers.',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=300&q=80',
    banner: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1200&q=80',
    category: 'Toys',
    channels: [
      { id: 'general', name: 'general', topic: 'Everything toys and childhood playground gear' },
      { id: 'beyblade-battles', name: 'beyblade-battles', topic: 'Let it rip! Metal vs plastic tips' },
      { id: 'tazos-collection', name: 'tazos-collection', topic: 'Show off your Pokémon & Looney Tunes tazos' },
      { id: 'boardgames', name: 'boardgames', topic: 'Business, Ludo, Snakes & Ladders tournaments' },
    ],
  },
  {
    name: 'r/2000sKids',
    slug: '2000skids',
    displayName: '2000s Kids Nostalgia',
    description: 'The golden generation between dial-up internet and smartphones. Summer holidays at Nani ghar, Cricket on street.',
    image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=300&q=80',
    banner: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    category: 'All',
    channels: [
      { id: 'general', name: 'general', topic: 'Living the peak 2000s childhood' },
      { id: 'summer-vacations', name: 'summer-vacations', topic: 'Rasna, Rooh Afza, and 2 months of pure freedom' },
      { id: 'diwali-holidays', name: 'diwali-holidays', topic: 'Crackers, sweets, and Cartoon Network marathon' },
      { id: 'nostalgia-feels', name: 'nostalgia-feels', topic: 'Things only 2000s kids understand' },
    ],
  },
  {
    name: 'r/SchoolMemories',
    slug: 'schoolmemories',
    displayName: 'School Recess & Classroom Tales',
    description: 'Natraj geometry box, Pen fight with Reynolds 045, FLAMES on back of notebook, book cricket during maths period.',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=300&q=80',
    banner: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
    category: 'School',
    channels: [
      { id: 'general', name: 'general', topic: 'School life before smartphones' },
      { id: 'lunch-box-trade', name: 'lunch-box-trade', topic: 'Trading Aloo Paratha for Maggi at 11 AM' },
      { id: 'pen-fights', name: 'pen-fights', topic: 'The illegal sport of every 7th grade bench' },
      { id: 'report-card-fear', name: 'report-card-fear', topic: 'Parents-teacher meeting survival tactics' },
    ],
  },
  {
    name: 'r/OldGadgets',
    slug: 'oldgadgets',
    displayName: 'Retro Gadgets & Tech',
    description: 'Nokia 1100 with torchlight, Sony Walkman cassette players, floppy disks, MP3 players with 128MB storage, CRT monitors.',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80',
    banner: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
    category: 'Gadgets',
    channels: [
      { id: 'general', name: 'general', topic: 'Tech that was indestructible and magic' },
      { id: 'nokia-snake', name: 'nokia-snake', topic: 'Surviving without touchscreen and endless battery' },
      { id: 'walkman-tapes', name: 'walkman-tapes', topic: 'Recording songs from FM radio onto cassette' },
      { id: 'cyber-cafes', name: 'cyber-cafes', topic: '₹15/hour Yahoo Messenger and Orkut sessions' },
    ],
  },
  {
    name: 'r/2000sFashion',
    slug: '2000sfashion',
    displayName: '2000s Fashion & Streetwear',
    description: 'Cargo pants with 8 pockets, spiked hair with Brylcreem, wristbands, bell-bottoms, graphic tees, and school canvas shoes.',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=300&q=80',
    banner: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=80',
    category: 'Clothes',
    channels: [
      { id: 'general', name: 'general', topic: 'The bold, chaotic fashion choices of the era' },
      { id: 'cargo-pants', name: 'cargo-pants', topic: 'Pockets for everything: Game Boy, keys, snacks' },
      { id: 'spiky-hair', name: 'spiky-hair', topic: 'The iconic boyband & anime spiked hairstyles' },
      { id: 'retro-fits', name: 'retro-fits', topic: 'Vintage school uniform and PT white shoes nostalgia' },
    ],
  },
];

export const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('🌱 Starting Backto Nostalgia database seed...');

    // Clear existing collections
    await User.deleteMany({});
    await Community.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    await Message.deleteMany({});

    console.log('🧹 Cleaned existing records.');

    // 1. Create Users
    const createdUsers = [];
    const salt = await bcrypt.genSalt(10);
    for (const u of demoUsersData) {
      const hashedPassword = await bcrypt.hash(u.password, salt);
      const user = await User.create({
        ...u,
        password: hashedPassword,
      });
      createdUsers.push(user);
    }
    console.log(`👤 Created ${createdUsers.length} demo nostalgia users.`);

    // 2. Create Communities
    const createdCommunities = [];
    for (const c of communitiesData) {
      // Assign random 5-8 users as initial members
      const shuffledUsers = [...createdUsers].sort(() => 0.5 - Math.random());
      const initialMembers = shuffledUsers.slice(0, 6).map((u) => u._id);

      const community = await Community.create({
        ...c,
        members: initialMembers,
      });
      createdCommunities.push(community);

      // Add to user's joinedCommunities
      for (const uid of initialMembers) {
        await User.findByIdAndUpdate(uid, {
          $addToSet: { joinedCommunities: community._id },
        });
      }
    }
    console.log(`🏰 Created ${createdCommunities.length} nostalgia communities.`);

    // Find communities by slug for easy post mapping
    const commMap = {};
    createdCommunities.forEach((c) => {
      commMap[c.slug] = c;
    });

    // 3. Create 25 Realistic Nostalgia Posts
    const postsData = [
      {
        userIndex: 0, // Rohan
        commSlug: 'indiancartoons',
        category: 'Cartoons',
        era: '2000s',
        title: 'Coming home at 4:30 PM just to catch Doraemon and Shinchan',
        story: 'Throwing the heavy school bag on the sofa, kicking off white canvas PT shoes, and mom serving hot Maggi or Bournvita right as the Doraemon title track starts. That carefree feeling after school was pure heaven. Who remembers Nobita asking for the Anywhere Door?',
        image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
      },
      {
        userIndex: 1, // Sneha
        commSlug: 'childhoodsnacks',
        category: 'Snacks',
        era: '2000s',
        title: 'Cadbury Bytes: The greatest snack that was brutally discontinued',
        story: 'Why did they stop making Bytes?! That crispy wafer pillow filled with silky Cadbury milk chocolate was absolute perfection. I would easily pay 10x the price today just to taste a single packet from 2005 again.',
        image: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&w=800&q=80',
      },
      {
        userIndex: 2, // Aditya
        commSlug: 'retrogaming',
        category: 'Games',
        era: '2000s',
        title: 'Road Rash: Kicking cops and using the XYZZY cheat code',
        story: 'Remember using the bat or chain on other riders on the California highway? Getting chased by Officer O’Leary and crashing into a cow at 160 MPH. Playing this on a bulky CRT monitor with Windows 98 or XP was unmatched.',
        image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
      },
      {
        userIndex: 3, // Karan
        commSlug: 'oldgadgets',
        category: 'Gadgets',
        era: '90s',
        title: 'The indestructible Nokia 1100 and the legendary Snake II game',
        story: 'One full charge lasted 9 whole days. You could drop it from the second floor, put the cover and battery back together, and it would still work flawlessly. And that top flashlight that saved us during summer power cuts!',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
      },
      {
        userIndex: 4, // Meera
        commSlug: 'oldtoys',
        category: 'Toys',
        era: '2000s',
        title: 'Spinning Beyblade tournaments on upside-down garbage can lids',
        story: 'Who had the metal face bolts and modified rip cords? We used to bring our Beyblade stadiums or just use big plastic washbasins in the colony park. "3, 2, 1... LET IT RIP!" screamed at the top of our lungs.',
        image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
      },
      {
        userIndex: 5, // Rahul
        commSlug: '2000skids',
        category: 'Cars',
        era: '90s',
        title: 'The iconic white Maruti 800: The official family time-machine',
        story: 'Non-AC, roll-down windows, rolling down the glass to feel the cool monsoon breeze, and cramming 8 family members + luggage for the annual road trip to Shimla or Nani ghar with Kumar Sanu playing on cassette.',
        image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
      },
      {
        userIndex: 6, // Aditi
        commSlug: 'childhoodsnacks',
        category: 'Snacks',
        era: '2000s',
        title: 'Phantom Sweet Cigarettes: Feeling like a Don in 4th grade',
        story: 'Holding that chalky peppermint stick between two fingers and blowing imaginary smoke in winter mornings before school prayer. Best ₹2 purchase from the corner kirana shop ever.',
        image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80',
      },
      {
        userIndex: 7, // Neha
        commSlug: 'schoolmemories',
        category: 'School',
        era: '2000s',
        title: 'Natraj Geometry Box & The Deadly Steel Compass',
        story: 'Opening that tin box with the smell of fresh lead and plastic rulers. And carving your initials or secret symbols onto the wooden classroom desks with the metal compass point during geography class.',
        image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
      },
      {
        userIndex: 8, // Arjun
        commSlug: 'retrogaming',
        category: 'Games',
        era: '2000s',
        title: 'GTA Vice City: Running to the cyber cafe with ₹20 in your pocket',
        story: 'Tommy Vercetti in that teal Hawaiian shirt, driving the Infernus along Ocean Beach listening to Emotion 98.3 and Flash FM. Getting stuck on "Demolition Man" RC Helicopter mission for two months!',
        image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
      },
      {
        userIndex: 9, // Sakshi
        commSlug: '2000skids',
        category: 'Cartoons',
        era: '2000s',
        title: 'Shaka Laka Boom Boom: We all bought that red magic pencil',
        story: 'Sanju drawing food or bicycles in his diary and it magically coming to life! Every fair and roadside stall started selling plastic replicas of the magic pencil with the curved face, and we genuinely tried drawing gold coins.',
        image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80',
      },
      {
        userIndex: 1, // Sneha
        commSlug: 'childhoodsnacks',
        category: 'Snacks',
        era: '90s',
        title: 'Mango Bite vs Kismi Bar: The eternal 1 rupee debate',
        story: 'Remember getting toffee in exchange for 50 paisa or ₹1 coin at the grocery shop because the uncle didn’t have change? Mango bite had that explosive sweet mango center that stuck to your molars for hours.',
        image: 'https://images.unsplash.com/photo-1575224300306-1b8da36134ec?auto=format&fit=crop&w=800&q=80',
      },
      {
        userIndex: 0, // Rohan
        commSlug: 'oldtoys',
        category: 'Toys',
        era: '2000s',
        title: 'Cheetos Pokémon Tazos: Complete 151 collection album',
        story: 'Buying 5 packets of Cheetos just for the Tazo inside, not even caring about the chips. Begging friends to trade Charizard for Blastoise during lunch break. Who still has their collection album safe in the cupboard?',
        image: 'https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?auto=format&fit=crop&w=800&q=80',
      },
      {
        userIndex: 3, // Karan
        commSlug: 'oldgadgets',
        category: 'Gadgets',
        era: '90s',
        title: 'Rewinding cassette tapes with a hexagonal Reynolds 045 pen',
        story: 'Saving Walkman AA pencil battery power by manually spinning the cassette spool with a ballpoint pen. Or putting a piece of scotch tape over the top tabs of a cassette to record over your parents’ ghazals with Lucky Ali songs.',
        image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
      },
      {
        userIndex: 2, // Aditya
        commSlug: 'retrogaming',
        category: 'Games',
        era: '90s',
        title: 'The Yellow 999999-in-1 Video Game Cassettes',
        story: 'It promised 999,999 games but it was literally just Duck Hunt, Super Mario, Contra, Battle City, and Circus Charlie repeated 500 times with different palette colors. But that light gun on Duck Hunt was pure sci-fi magic.',
        image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
      },
      {
        userIndex: 6, // Aditi
        commSlug: 'schoolmemories',
        category: 'School',
        era: '2000s',
        title: 'The Pen Fight League: Reynolds vs Trimax vs Gel pens',
        story: 'Upgrading your pen by putting glue or tape inside the cap to make it heavier for knockouts. Two pens, one bench, absolute silence so the English teacher wouldn’t confiscate your weapon.',
        image: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=800&q=80',
      },
      {
        userIndex: 4, // Meera
        commSlug: 'indiancartoons',
        category: 'Cartoons',
        era: '90s',
        title: 'Swat Kats, Captain Planet, and Dexter’s Laboratory',
        story: 'The Cartoon Cartoon Fridays lineup was peak television history. T-Bone and Razor flying the Turbokat over Megakat City with that banging guitar riff intro. Nothing made today matches that level of energy.',
        image: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80',
      },
      {
        userIndex: 5, // Rahul
        commSlug: '2000skids',
        category: 'Music',
        era: '2000s',
        title: 'Euphoria, Lucky Ali, Silk Route & 90s Indipop era',
        story: '"O Sanam", "Maaeri", "Dooba Dooba". The music videos had better storylines and cinematography than modern movies. Sitting in front of Channel [V] and MTV waiting for the top 10 countdown.',
        image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
      },
      {
        userIndex: 7, // Neha
        commSlug: '2000sfashion',
        category: 'Clothes',
        era: '2000s',
        title: 'Cargo pants with zip-off shorts and 14 zipper pockets',
        story: 'Walking into school or tuition with baggy green cargos. You had pockets for your Digimon virtual pet, chewing gum, 10-rupee notes, keys, and water bottle. Unzipping the knees in summer to turn them into bermudas!',
        image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
      },
      {
        userIndex: 8, // Arjun
        commSlug: 'oldtoys',
        category: 'Toys',
        era: '90s',
        title: 'WWE Trump Cards: Undertaker 7 Rank 1 undefeated',
        story: 'Card battles on the school bus: "Rank!", "Chest 54!", "Height 6 feet 10 inches!". If someone pulled the Undertaker card or The Rock card, the match was virtually won on the spot.',
        image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
      },
      {
        userIndex: 9, // Sakshi
        commSlug: 'childhoodsnacks',
        category: 'Snacks',
        era: '2000s',
        title: 'Boomer Bubble Gum: "Boomer Bada Boomer!" and comic wrappers',
        story: 'Blowing huge pink bubbles and accidentally getting them stuck in your eyelashes and hair. And reading the mini Boomer superhero comic strip wrapped around every single piece.',
        image: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&w=800&q=80',
      },
      {
        userIndex: 2, // Aditya
        commSlug: 'oldgadgets',
        category: 'Gadgets',
        era: '2000s',
        title: 'Dial-up internet connection sound: Screeech-Krrr-Beep-Boop',
        story: 'Waiting for 10 PM so the telephone bill would be cheaper. Disconnecting the landline wire, clicking Connect on MTNL or VSNL, holding your breath while the modem dialed, and praying mom didn’t pick up the phone receiver.',
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
      },
      {
        userIndex: 6, // Aditi
        commSlug: 'schoolmemories',
        category: 'School',
        era: '2000s',
        title: 'Playing Book Cricket during the last 15 minutes of Maths class',
        story: 'Opening the RD Sharma or NCERT textbook randomly, looking at the right-hand page number last digit: 2 = 2 runs, 4 = four, 6 = six, 8 = eight, 0 = OUT! Filling entire back pages with team scorecards.',
        image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
      },
      {
        userIndex: 0, // Rohan
        commSlug: '2000skids',
        category: 'Movies',
        era: '2000s',
        title: 'Koi Mil Gaya and Krrish: Jadoo calling the spaceship with solar computer',
        story: 'Om Om Om Om... Everyone rushed outside in the afternoon holding magnifying glasses and mirrors trying to talk to aliens. And wearing the plastic Krrish black masks sold at Diwali mela.',
        image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
      },
      {
        userIndex: 1, // Sneha
        commSlug: 'childhoodsnacks',
        category: 'Snacks',
        era: '90s',
        title: 'Crax Corn Curls: Wearing the rings on all 10 fingers before eating',
        story: 'The only correct way to consume Crax was sliding one ring onto each of your 10 fingers, pretending you had diamond jewelry or Wolverine claws, and eating them one by one. Plus finding the plastic toy hidden inside!',
        image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=800&q=80',
      },
      {
        userIndex: 3, // Karan
        commSlug: 'oldgadgets',
        category: 'Comics',
        era: '90s',
        title: 'Chacha Chaudhary, Sabu, Billoo and Pinki comic books',
        story: '"Chacha Chaudhary ka dimaag computer se bhi tez chalta hai" and "Jab Sabu ko gussa aata hai to kahin jwalamukhi phat-ta hai". Buying Diamond Comics at the railway station A.H. Wheeler stall before long train journeys.',
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      },
    ];

    const createdPosts = [];
    for (const p of postsData) {
      const author = createdUsers[p.userIndex];
      const comm = commMap[p.commSlug];

      // Give each post random likes from other users
      const randomLikes = createdUsers
        .filter((_, idx) => idx !== p.userIndex && Math.random() > 0.3)
        .map((u) => u._id);

      const post = await Post.create({
        author: author._id,
        title: p.title,
        story: p.story,
        image: p.image,
        category: p.category,
        era: p.era,
        community: comm ? comm._id : null,
        likes: randomLikes,
        comments: [],
      });

      createdPosts.push(post);
    }
    console.log(`📝 Created ${createdPosts.length} nostalgia posts.`);

    // 4. Create 30+ Realistic Comments
    const commentTexts = [
      'Omg this unlocked a deep core memory! Literally forgot this existed 😭',
      'This was my entire childhood! Used to save ₹5 every week just for this.',
      'I still remember the exact smell and taste of this. Best days of our lives.',
      'My mom used to yell at me for doing this after school haha!',
      'Kids today will never know the pure joy of experiencing this without internet.',
      '100% accurate. Golden era of growing up!',
      'Bro I literally had the exact same experience with my colony friends.',
      'Take me back in a time machine please 🥺✨',
      'The sheer nostalgia hitting right now is crazy.',
      'I still have mine packed in my old school box at parents house!',
      'Wait, remember the TV commercial song for this? It was so catchy!',
      'We really lived through the best timeline for childhood.',
      'This was peak luxury back in 2004.',
      'Bro Officer O’Leary in Road Rash gave me trust issues for life 😂',
      'The Anywhere door is still on my adult wishlist tbh.',
      'That dial-up internet connection sound is tattooed into my brain forever.',
    ];

    let commentCount = 0;
    for (let i = 0; i < createdPosts.length; i++) {
      const post = createdPosts[i];
      // Add 1-3 comments per post
      const numComments = (i % 3) + 1;
      for (let j = 0; j < numComments; j++) {
        const commenter = createdUsers[(i + j + 1) % createdUsers.length];
        const text = commentTexts[(i * 2 + j) % commentTexts.length];

        const comment = await Comment.create({
          post: post._id,
          author: commenter._id,
          text,
        });

        post.comments.push(comment._id);
        commentCount++;
      }
      await post.save();
    }
    console.log(`💬 Created ${commentCount} realistic community comments.`);

    // 5. Add some saved posts to users for Time Capsule demonstration
    for (let i = 0; i < createdUsers.length; i++) {
      const user = createdUsers[i];
      // Save 3-5 distinct posts
      const saved = createdPosts
        .filter((_, idx) => (idx + i) % 4 === 0)
        .map((p) => p._id);
      await User.findByIdAndUpdate(user._id, {
        $set: { savedPosts: saved },
      });
    }
    console.log('📦 Populated sample saved posts in Time Capsules.');

    // 6. Create realistic seed chat messages for communities
    const sampleChatMessages = [
      {
        commSlug: 'indiancartoons',
        channel: 'general',
        senderIdx: 0, // Rohan
        text: 'Anyone remember coming home at 4 PM just to watch Doraemon? 😂',
      },
      {
        commSlug: 'indiancartoons',
        channel: 'general',
        senderIdx: 1, // Sneha
        text: 'YES 😭 That was literally my daily routine every single evening.',
      },
      {
        commSlug: 'indiancartoons',
        channel: 'general',
        senderIdx: 2, // Aditya
        text: 'And Shinchan right after Doraemon was pure comedy gold in Hindi dub!',
      },
      {
        commSlug: 'indiancartoons',
        channel: 'doraemon',
        senderIdx: 4, // Meera
        text: 'Which gadget would you pick if you could have only one in real life?',
      },
      {
        commSlug: 'indiancartoons',
        channel: 'doraemon',
        senderIdx: 0, // Rohan
        text: 'Anywhere Door, without a second thought. Zero Bangalore traffic!',
      },
      {
        commSlug: 'childhoodsnacks',
        channel: 'general',
        senderIdx: 6, // Aditi
        text: 'If you could bring back ONE discontinued snack, what would it be?',
      },
      {
        commSlug: 'childhoodsnacks',
        channel: 'general',
        senderIdx: 1, // Sneha
        text: 'Cadbury Bytes. Nothing else comes close, petition to relaunch it!',
      },
      {
        commSlug: 'retrogaming',
        channel: 'general',
        senderIdx: 8, // Arjun
        text: 'Who remember the cheat code for infinite health in Vice City?',
      },
      {
        commSlug: 'retrogaming',
        channel: 'general',
        senderIdx: 2, // Aditya
        text: 'ASPIRINE for health, PRECIOUSPROTECTION for armor, and PANZER for the tank!',
      },
      {
        commSlug: 'oldtoys',
        channel: 'beyblade-battles',
        senderIdx: 0, // Rohan
        text: 'Dragoon V2 with the rubber tip was basically unstoppable on flat ground.',
      },
    ];

    for (const msg of sampleChatMessages) {
      const comm = commMap[msg.commSlug];
      const sender = createdUsers[msg.senderIdx];
      if (comm && sender) {
        await Message.create({
          communityId: comm._id,
          channel: msg.channel,
          sender: sender._id,
          text: msg.text,
        });
      }
    }
    console.log(`💬 Seeded ${sampleChatMessages.length} real-time channel messages.`);

    console.log('🎉 Seeding successfully completed! Database is fully populated with Backto Nostalgia demo data.');
    return true;
  } catch (err) {
    console.error('❌ Seeding error:', err);
    throw err;
  }
};

// If run directly via CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedDatabase()
    .then(() => {
      console.log('✅ Done seeding.');
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
