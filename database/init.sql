-- Script de inicialização do banco de dados LETZ
-- Este script será executado automaticamente quando o container PostgreSQL for criado

-- Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Inserir badges padrão do sistema
INSERT INTO badges (name, description, icon, type, points_required, condition, is_active, created_at) VALUES
('Primeiro Evento', 'Criou seu primeiro evento', '🎉', 'ORGANIZER', 0, '{"eventsCreated": 1}', true, NOW()),
('Organizador Iniciante', 'Criou 5 eventos', '📅', 'ORGANIZER', 250, '{"eventsCreated": 5}', true, NOW()),
('Mestre dos Eventos', 'Criou 20 eventos', '👑', 'ORGANIZER', 1000, '{"eventsCreated": 20}', true, NOW()),
('Participante Ativo', 'Participou de 10 eventos', '🎪', 'PARTICIPANT', 200, '{"eventsAttended": 10}', true, NOW()),
('Rei da Festa', 'Participou de 50 eventos', '🎊', 'PARTICIPANT', 1000, '{"eventsAttended": 50}', true, NOW()),
('Social', 'Tem 10 amigos', '👥', 'SOCIAL', 100, '{"totalFriends": 10}', true, NOW()),
('Popular', 'Tem 50 amigos', '🌟', 'SOCIAL', 500, '{"totalFriends": 50}', true, NOW()),
('Pontual', 'Confirmou presença em 20 eventos', '⏰', 'SPECIAL', 400, '{"confirmedEvents": 20}', true, NOW()),
('Veterano', 'Usuário há mais de 1 ano', '🏆', 'MILESTONE', 365, '{"daysActive": 365}', true, NOW()),
('Influencer', 'Tem mais de 1000 pontos', '💎', 'SPECIAL', 1000, '{"points": 1000}', true, NOW())
ON CONFLICT (name) DO NOTHING;

-- Inserir usuário administrador padrão (senha: admin123)
INSERT INTO users (
    email, password, first_name, last_name, username, 
    is_active, is_email_verified, role, events_created, 
    events_attended, total_friends, points, created_at, updated_at
) VALUES (
    'admin@letz.com', 
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- admin123
    'Admin', 
    'LETZ', 
    'admin', 
    true, 
    true, 
    'ADMIN', 
    0, 
    0, 
    0, 
    0, 
    NOW(), 
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- Inserir alguns usuários de exemplo
INSERT INTO users (
    email, password, first_name, last_name, username, 
    bio, is_active, is_email_verified, role, events_created, 
    events_attended, total_friends, points, created_at, updated_at
) VALUES 
(
    'joao@exemplo.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- admin123
    'João',
    'Silva',
    'joao_silva',
    'Adoro organizar churrascos e festas!',
    true,
    true,
    'USER',
    5,
    12,
    8,
    340,
    NOW(),
    NOW()
),
(
    'maria@exemplo.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- admin123
    'Maria',
    'Santos',
    'maria_santos',
    'Sempre pronta para uma boa festa!',
    true,
    true,
    'USER',
    3,
    18,
    15,
    450,
    NOW(),
    NOW()
),
(
    'pedro@exemplo.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- admin123
    'Pedro',
    'Costa',
    'pedro_costa',
    'Especialista em churrascos e happy hours!',
    true,
    true,
    'USER',
    8,
    25,
    12,
    620,
    NOW(),
    NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Criar algumas amizades de exemplo
DO $$
DECLARE
    joao_id INTEGER;
    maria_id INTEGER;
    pedro_id INTEGER;
BEGIN
    SELECT id INTO joao_id FROM users WHERE email = 'joao@exemplo.com';
    SELECT id INTO maria_id FROM users WHERE email = 'maria@exemplo.com';
    SELECT id INTO pedro_id FROM users WHERE email = 'pedro@exemplo.com';
    
    IF joao_id IS NOT NULL AND maria_id IS NOT NULL THEN
        INSERT INTO friendships (requester_id, addressee_id, status, created_at, updated_at, accepted_at)
        VALUES (joao_id, maria_id, 'ACCEPTED', NOW(), NOW(), NOW())
        ON CONFLICT DO NOTHING;
    END IF;
    
    IF joao_id IS NOT NULL AND pedro_id IS NOT NULL THEN
        INSERT INTO friendships (requester_id, addressee_id, status, created_at, updated_at, accepted_at)
        VALUES (joao_id, pedro_id, 'ACCEPTED', NOW(), NOW(), NOW())
        ON CONFLICT DO NOTHING;
    END IF;
    
    IF maria_id IS NOT NULL AND pedro_id IS NOT NULL THEN
        INSERT INTO friendships (requester_id, addressee_id, status, created_at, updated_at, accepted_at)
        VALUES (maria_id, pedro_id, 'ACCEPTED', NOW(), NOW(), NOW())
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- Criar alguns eventos de exemplo
DO $$
DECLARE
    joao_id INTEGER;
    maria_id INTEGER;
    pedro_id INTEGER;
    event1_id INTEGER;
    event2_id INTEGER;
BEGIN
    SELECT id INTO joao_id FROM users WHERE email = 'joao@exemplo.com';
    SELECT id INTO maria_id FROM users WHERE email = 'maria@exemplo.com';
    SELECT id INTO pedro_id FROM users WHERE email = 'pedro@exemplo.com';
    
    IF joao_id IS NOT NULL THEN
        INSERT INTO events (
            title, description, type, start_date_time, end_date_time,
            location, address, organizer_id, max_participants, is_private,
            requires_approval, has_cost_sharing, invite_code, status,
            created_at, updated_at
        ) VALUES (
            'Churrasco de Final de Semana',
            'Vamos fazer um churrasco incrível para relaxar no final de semana! Traga sua família e amigos.',
            'CHURRASCO',
            NOW() + INTERVAL '7 days',
            NOW() + INTERVAL '7 days' + INTERVAL '6 hours',
            'Casa do João',
            'Rua das Flores, 123 - São Paulo, SP',
            joao_id,
            20,
            true,
            false,
            true,
            uuid_generate_v4()::text,
            'PLANNED',
            NOW(),
            NOW()
        ) RETURNING id INTO event1_id;
    END IF;
    
    IF maria_id IS NOT NULL THEN
        INSERT INTO events (
            title, description, type, start_date_time, end_date_time,
            location, address, organizer_id, max_participants, is_private,
            requires_approval, has_cost_sharing, invite_code, status,
            created_at, updated_at
        ) VALUES (
            'Festa de Aniversário da Maria',
            'Venha comemorar meus 25 anos! Vai ter bolo, música e muita diversão!',
            'FESTA_ANIVERSARIO',
            NOW() + INTERVAL '14 days',
            NOW() + INTERVAL '14 days' + INTERVAL '8 hours',
            'Salão de Festas',
            'Av. Principal, 456 - São Paulo, SP',
            maria_id,
            50,
            true,
            true,
            false,
            uuid_generate_v4()::text,
            'PLANNED',
            NOW(),
            NOW()
        ) RETURNING id INTO event2_id;
    END IF;
    
    -- Adicionar participantes aos eventos
    IF event1_id IS NOT NULL AND maria_id IS NOT NULL THEN
        INSERT INTO event_participants (event_id, user_id, status, created_at, updated_at, confirmed_at)
        VALUES (event1_id, maria_id, 'CONFIRMED', NOW(), NOW(), NOW());
    END IF;
    
    IF event1_id IS NOT NULL AND pedro_id IS NOT NULL THEN
        INSERT INTO event_participants (event_id, user_id, status, created_at, updated_at, confirmed_at)
        VALUES (event1_id, pedro_id, 'CONFIRMED', NOW(), NOW(), NOW());
    END IF;
    
    IF event2_id IS NOT NULL AND joao_id IS NOT NULL THEN
        INSERT INTO event_participants (event_id, user_id, status, created_at, updated_at)
        VALUES (event2_id, joao_id, 'PENDING', NOW(), NOW());
    END IF;
    
    -- Adicionar itens aos eventos
    IF event1_id IS NOT NULL THEN
        INSERT INTO event_items (event_id, name, description, quantity, category, is_required, is_monetary, estimated_cost, created_at, updated_at)
        VALUES 
        (event1_id, 'Carne Bovina', 'Picanha e alcatra para o churrasco', 3, 'Comida', true, false, 150.00, NOW(), NOW()),
        (event1_id, 'Cerveja', 'Cerveja gelada para todos', 2, 'Bebida', true, false, 80.00, NOW(), NOW()),
        (event1_id, 'Carvão', 'Carvão para a churrasqueira', 2, 'Utensílios', true, false, 30.00, NOW(), NOW()),
        (event1_id, 'Refrigerante', 'Para quem não bebe álcool', 1, 'Bebida', false, false, 25.00, NOW(), NOW());
    END IF;
    
    IF event2_id IS NOT NULL THEN
        INSERT INTO event_items (event_id, name, description, quantity, category, is_required, is_monetary, estimated_cost, created_at, updated_at)
        VALUES 
        (event2_id, 'Bolo de Aniversário', 'Bolo especial de chocolate', 1, 'Comida', true, false, 80.00, NOW(), NOW()),
        (event2_id, 'Decoração', 'Balões e enfeites', 1, 'Decoração', true, false, 50.00, NOW(), NOW()),
        (event2_id, 'Som', 'Sistema de som para a festa', 1, 'Equipamento', true, false, 100.00, NOW(), NOW());
    END IF;
END $$;

-- Atribuir badges aos usuários de exemplo
DO $$
DECLARE
    joao_id INTEGER;
    maria_id INTEGER;
    pedro_id INTEGER;
    badge_id INTEGER;
BEGIN
    SELECT id INTO joao_id FROM users WHERE email = 'joao@exemplo.com';
    SELECT id INTO maria_id FROM users WHERE email = 'maria@exemplo.com';
    SELECT id INTO pedro_id FROM users WHERE email = 'pedro@exemplo.com';
    
    -- Badge "Primeiro Evento" para todos
    SELECT id INTO badge_id FROM badges WHERE name = 'Primeiro Evento';
    IF badge_id IS NOT NULL THEN
        INSERT INTO user_badges (user_id, badge_id, earned_at, notes)
        VALUES 
        (joao_id, badge_id, NOW(), 'Criou seu primeiro churrasco!'),
        (maria_id, badge_id, NOW(), 'Organizou sua primeira festa!'),
        (pedro_id, badge_id, NOW(), 'Começou a organizar eventos!')
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- Badge "Organizador Iniciante" para João
    SELECT id INTO badge_id FROM badges WHERE name = 'Organizador Iniciante';
    IF badge_id IS NOT NULL AND joao_id IS NOT NULL THEN
        INSERT INTO user_badges (user_id, badge_id, earned_at, notes)
        VALUES (joao_id, badge_id, NOW(), 'Já organizou 5 eventos incríveis!')
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- Badge "Social" para Maria
    SELECT id INTO badge_id FROM badges WHERE name = 'Social';
    IF badge_id IS NOT NULL AND maria_id IS NOT NULL THEN
        INSERT INTO user_badges (user_id, badge_id, earned_at, notes)
        VALUES (maria_id, badge_id, NOW(), 'Tem muitos amigos na plataforma!')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- Inserir algumas mensagens de exemplo
DO $$
DECLARE
    joao_id INTEGER;
    maria_id INTEGER;
    pedro_id INTEGER;
BEGIN
    SELECT id INTO joao_id FROM users WHERE email = 'joao@exemplo.com';
    SELECT id INTO maria_id FROM users WHERE email = 'maria@exemplo.com';
    SELECT id INTO pedro_id FROM users WHERE email = 'pedro@exemplo.com';
    
    IF joao_id IS NOT NULL AND maria_id IS NOT NULL THEN
        INSERT INTO messages (sender_id, receiver_id, content, type, is_read, created_at)
        VALUES 
        (joao_id, maria_id, 'Oi Maria! Você vai no meu churrasco no sábado?', 'TEXT', true, NOW() - INTERVAL '2 hours'),
        (maria_id, joao_id, 'Claro! Já confirmei minha presença. Posso levar alguma coisa?', 'TEXT', true, NOW() - INTERVAL '1 hour'),
        (joao_id, maria_id, 'Pode trazer uma sobremesa se quiser! Vai ser demais!', 'TEXT', false, NOW() - INTERVAL '30 minutes');
    END IF;
END $$;

-- Atualizar estatísticas dos usuários
UPDATE users SET 
    total_friends = (
        SELECT COUNT(*) FROM friendships 
        WHERE (requester_id = users.id OR addressee_id = users.id) 
        AND status = 'ACCEPTED'
    );

COMMIT; 