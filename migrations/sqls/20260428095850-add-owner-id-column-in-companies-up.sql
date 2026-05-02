ALTER TABLE companies 
ADD COLUMN owner_id UUID UNIQUE, 
ADD CONSTRAINT fk_user FOREIGN KEY (owner_id) REFERENCES users(id);
