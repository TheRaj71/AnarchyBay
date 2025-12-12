-- Create contacts table to store messages from the site
create table if not exists contacts (
    -- Primary Key: Uses UUID for distributed primary keys, ensuring global uniqueness.
    -- We add NOT NULL constraint for explicit clarity, although PRIMARY KEY implies it.
    id uuid default gen_random_uuid() primary key not null, 
    
    -- Sender's Name: Must be present.
    name text not null,
    
    -- Sender's Email: Must be present. We add a check for basic email format validity (optional but good practice).
    email text not null check (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'),
    
    -- Subject: Optional, as indicated by the absence of NOT NULL.
    subject text,
    
    -- Message Body: Must be present.
    message text not null,
    
    -- Timestamp: Automatically records when the message was received.
    created_at timestamptz default now() not null
);

-- Index for chronological sorting and efficient fetching of recent contacts/messages.
-- This remains highly efficient for your "created_at" column.
create index if not exists idx_contacts_created_at on contacts using btree(created_at desc);