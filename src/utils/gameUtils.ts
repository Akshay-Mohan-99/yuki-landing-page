import { Cat, Player } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from './supabase';
const DEFAULT_PASSWORD = import.meta.env.VITE_KNOWN_PASSWORD;

// Cat images
const CAT_IMAGES = {
  common: [
    '/assets/stickers/image_768.png',
    '/assets/stickers/image_769.png',
    '/assets/stickers/image_771.png',
    '/assets/stickers/image_773.png',
    '/assets/stickers/image_774.png',
  ],
  rare: [
    '/assets/stickers/image_770.png',
    '/assets/stickers/image_775.png'
  ],
  legendary: [
    '/assets/stickers/image_772.png'
  ]
};

export const getRandomPosition = (width: number, height: number) => {
  const x = Math.random() * width;
  const y = height + 100; // Always spawn slightly below the screen

  return { x, y };
};



export const generateCat = (width: number, height: number): Cat => {
  const rand = Math.random();
  let type: 'common' | 'rare' | 'legendary';
  let points: number;
  let speed: number;
  
  if (rand < 0.7) {
    type = 'common';
    points = 1;
    speed = 0.3 + Math.random() * 0.4;
  } else if (rand < 0.95) {
    type = 'rare';
    points = 3;
    speed = 0.7 + Math.random() * 0.5;
  } else {
    type = 'legendary';
    points = 5;
    speed = 1 + Math.random() * 0.7;
  }
  
  const images = CAT_IMAGES[type];
  const image = images[Math.floor(Math.random() * images.length)];
  
  return {
    id: uuidv4(),
    image,
    points,
    type,
    speed,
    position: getRandomPosition(width, height)
  };
};

export const getLeaderboardData = async (): Promise<Player[]> => {
  const { data: scores, error } = await supabase
    .from('scores')
    .select(`
      score,
      profiles (
        *
      ),
      created_at
    `)
    .order('score', { ascending: false })
    .limit(10);



  if (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }

  return scores.map(score => ({
    email: score.profiles.email,
    score: score.score,
    verified: true,
    date: new Date(score.created_at).toLocaleDateString()
  }));
};

export const sendVerificationEmail = async (email: string, score: number): Promise<boolean> => {
  try {

    let currentUser = null;
    const savedUser = localStorage.getItem(`user-${email}`);

    if(savedUser){
      currentUser = JSON.parse(localStorage.getItem(`user-${email}`) || '');
    } else {
      // Try to sign up first
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email,
        password: uuidv4(), // Random password
      });

      if (signUpError) {
        if (signUpError.message.includes('User already registered')) {
          // If user already exists, try logging in
          const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password: DEFAULT_PASSWORD
          });

          if (loginError) throw loginError;

          if (loginData.user) {
            currentUser = loginData.user;
          } else {
            throw new Error('No user returned on login');
          }
        } else {
          throw signUpError;
        }
      } else {
        currentUser = user;
      } 

    }
    
    if (!currentUser) throw new Error('No user returned from signup');
    // Store new user into localStorage
    localStorage.setItem(`user-${email}`, JSON.stringify({...currentUser, savedAt: Date.now()}));

    // Insert the score
    const { error: scoreError } = await supabase
      .from('scores')
      .insert([
        {
          user_id: currentUser.id,
          score: score
        }
      ]);

    if (scoreError) throw scoreError;

    return true;
  } catch (error) {
    console.error('Error during signup/login/score insert:', error);
    return false;
  }
};

