insert into public.roles (
        name,
        display_name,
        description,
        permissions,
        is_system
    )
values (
        'shooter',
        'Shooter',
        'Registered para-shooter with access to personal dashboard, competition registration, and score viewing.',
        '{
        "profile": ["read", "update"],
        "competitions": ["read", "register"],
        "scores": ["read"],
        "payments": ["create", "read"],
        "documents": ["read", "download"]
    }'::jsonb,
        true
    ),
    (
        'coach',
        'Coach',
        'Team coach with access to shooter information and competition details.',
        '{
        "shooters": ["read"],
        "competitions": ["read"],
        "scores": ["read"],
        "documents": ["read", "download"]
    }'::jsonb,
        true
    ),
    (
        'official',
        'Official',
        'Competition official with access to scoring and shooter verification.',
        '{
        "competitions": ["read"],
        "scores": ["create", "read", "update"],
        "shooters": ["read"]
    }'::jsonb,
        true
    ),
    (
        'viewer',
        'Viewer',
        'Read-only access to public information.',
        '{
        "news": ["read"],
        "competitions": ["read"],
        "rankings": ["read"],
        "documents": ["read"]
    }'::jsonb,
        true
    ) ON CONFLICT (name) DO NOTHING;