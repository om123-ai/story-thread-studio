-- Create storage bucket for character images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('character-images', 'character-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies for character images
CREATE POLICY "Anyone can view character images"
ON storage.objects FOR SELECT
USING (bucket_id = 'character-images');

CREATE POLICY "Authenticated users can upload character images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'character-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own character images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'character-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their own character images"
ON storage.objects FOR DELETE
USING (bucket_id = 'character-images' AND auth.uid() IS NOT NULL);