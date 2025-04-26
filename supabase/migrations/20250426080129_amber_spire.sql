/*
  # Create scores table for leaderboard

  1. New Tables
    - `scores`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `score` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `scores` table
    - Add policies for:
      - Anyone can read scores
      - Authenticated users can insert their own scores
*/

CREATE TABLE IF NOT EXISTS scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  score integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read scores
CREATE POLICY "Anyone can read scores"
  ON scores
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to insert their own scores
CREATE POLICY "Users can insert their own scores"
  ON scores
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);