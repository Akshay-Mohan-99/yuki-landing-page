import { Cat, Player, Scores } from "../types";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "./supabase";

// Cat images
const CAT_IMAGES = {
  common: [
    "/assets/stickers/image_768.png",
    "/assets/stickers/image_769.png",
    "/assets/stickers/image_771.png",
    "/assets/stickers/image_773.png",
    "/assets/stickers/image_774.png",
    "/assets/stickers/image_770.png",
    "/assets/stickers/image_775.png",
    "/assets/stickers/image_772.png",
  ],
  rare: [
    "/assets/stickers/Gold_1.svg",
    "/assets/stickers/Gold_2.svg",
    "/assets/stickers/Gold_3.svg",
    "/assets/stickers/Gold_4.svg",
  ],
  legendary: ["/assets/stickers/Super_rare.svg"],
};

export const getRandomPosition = (width: number, height: number) => {
  const x = Math.random() * width;
  const y = height + 100; // Always spawn slightly below the screen

  return { x, y };
};

export const generateCat = (width: number, height: number): Cat => {
  const rand = Math.random();
  let type: "common" | "rare" | "legendary";
  let points: number;
  let speed: number;

  if (rand < 0.7) {
    type = "common";
    points = 1;
    speed = 0.3 + Math.random() * 0.4;
  } else if (rand < 0.95) {
    type = "rare";
    points = 3;
    speed = 0.7 + Math.random() * 0.5;
  } else {
    type = "legendary";
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
    position: getRandomPosition(width, height),
  };
};

export const getLeaderboardData = async (): Promise<Scores[]> => {
  const { data: scores, error } = await supabase
    .from("scores")
    .select(
      `
      score,
      profiles (
        *
      ),
      created_at
    `
    )
    .order("score", { ascending: false })
    .limit(10);

  if (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }

  return scores.map((score) => ({
    user_id: score.profiles.id,
    name: score.profiles.name,
    score: score.score,
    date: new Date(score.created_at).toLocaleDateString(),
  }));
};

export const sendVerificationEmail = async (
  email: string,
  name: string,
  score: number,
  scoreId?: string | null
): Promise<null | string> => {
  try {
    let currentUser = null;

    try {
      const { data: userProfile, error: userProfileError } = await supabase
        .from("profiles")
        .select("id, name")
        .eq("email", email) // ⬅️ filter by the field you want
        .single();

      if (!userProfileError && userProfile) {
        currentUser = userProfile;
      }
    } catch (e) {
      console.error("user not in profiles", e);
    }

    if (!currentUser) {
      // Try to sign up first
      const {
        data: { user },
        error: signUpError,
      } = await supabase.auth.signUp({
        email,
        password: uuidv4(),
        options: {
          data: {
            name,
          },
        },
      });

      if (!signUpError && user) {
        const { data: userProfile } = await supabase
          .from("profiles")
          .select("id, name")
          .eq("email", email) // ⬅️ filter by the field you want
          .single();
        currentUser = userProfile;
      }
    }

    if (!currentUser) throw new Error("No user returned from signup");
    // Store new user into localStorage
    localStorage.setItem(
      `user-${email}`,
      JSON.stringify({ ...currentUser, savedAt: Date.now(), email })
    );

    let generatedId;

    if (scoreId) {
      const { data: updatedData, error: updateError } = await supabase
        .from("scores")
        .update({ user_id: currentUser.id })
        .eq("id", scoreId) // scoreId is the ID of the row you want to update
        .select(); // optional: returns the updated row
      if (updateError) throw updateError;
      generatedId = updatedData[0].id;
    } else {
      // Insert the score
      const { data: insertedData, error: scoreError } = await supabase
        .from("scores")
        .insert([
          {
            user_id: currentUser.id,
            score: score,
          },
        ])
        .select();
      if (scoreError) throw scoreError;
      generatedId = insertedData[0].id;
    }

    return generatedId;
  } catch (error) {
    console.error("Error during signup/login/score insert:", error);
    return null;
  }
};
