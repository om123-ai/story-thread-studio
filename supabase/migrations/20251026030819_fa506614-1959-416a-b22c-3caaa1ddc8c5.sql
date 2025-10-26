-- Fix image URLs for seed characters to use proper asset paths
UPDATE characters 
SET image_url = CASE name
  WHEN 'Mrs. Sharma' THEN 'mrs-sharma.jpg'
  WHEN 'Anita' THEN 'anita.jpg'
  WHEN 'Rhea' THEN 'rhea.jpg'
  WHEN 'Sangeeta' THEN 'sangeeta.jpg'
  WHEN 'Rekha' THEN 'rekha.jpg'
  WHEN 'Preeti' THEN 'preeti.jpg'
  WHEN 'Kavita' THEN 'kavita.jpg'
  WHEN 'Dr. Tanvi' THEN 'tanvi.jpg'
  ELSE image_url
END
WHERE is_seed = true;