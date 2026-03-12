-- Create a new public storage bucket for portfolio images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio-images', 'portfolio-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up Row Level Security (RLS) for the bucket
-- Allow public read access to anyone
CREATE POLICY "Public Access" 
  ON storage.objects FOR SELECT 
  USING ( bucket_id = 'portfolio-images' );

-- Allow authenticated users (admin) to insert files
CREATE POLICY "Admin Upload Access" 
  ON storage.objects FOR INSERT 
  TO authenticated 
  WITH CHECK ( bucket_id = 'portfolio-images' );

-- Allow authenticated users to update their files
CREATE POLICY "Admin Update Access" 
  ON storage.objects FOR UPDATE 
  TO authenticated 
  USING ( bucket_id = 'portfolio-images' );

-- Allow authenticated users to delete files
CREATE POLICY "Admin Delete Access" 
  ON storage.objects FOR DELETE 
  TO authenticated 
  USING ( bucket_id = 'portfolio-images' );
